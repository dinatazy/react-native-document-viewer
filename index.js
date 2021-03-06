import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, TextInput, Icon, Image, Text, Keyboard } from 'react-native'
// import { RNPrint } from 'NativeModules';
import RNFetchBlob from 'react-native-fetch-blob';
import Pdf from 'react-native-pdf';
import { styles } from './src/style';
import { NativeModules } from 'react-native';
import Toast from 'react-native-simple-toast';
import Reactotron from 'reactotron-react-native'

const { RNPrint } = NativeModules;

console.log(RNPrint)

const
    pageDownIcon = require('./src/images/icon-next.png'),
    pageUpIcon = require('./src/images/icon-back.png'),
    download = require('./src/images/download.png'),
    print = require('./src/images/print.png'),
    close = require('./src/images/close.png'),
    firstPage = require('./src/images/first-page.png'),
    lastPage = require('./src/images/last-page.png'),
    plus = require('./src/images/plus.png')
// lastPage = require('./src/images/last-page.png')


// const { PDF } = NativeModules;

export default class RNDocumentViewer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            pageCount: 1,
            visible: false,
            scale: 1,
            minScale: 0.5,
            maxScale: 2,
            zoomRange: 0.25
        };
        this.pdf = null;
    }

    componentWillMount() {
        this.setState({
            visible: this.props.visible
        })
        Reactotron.log("PDF",this.pdf)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }
    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide,
        );
      }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }


    _keyboardDidHide = () => {
        let { page } = this.state
        if((typeof(page)) === 'number'){
            this.pdf.setNativeProps({ page: parseInt(page)});
        }
    }
    

    prePage = () => {
        if (this.pdf) {
            let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
            Reactotron.log("prePage",prePage)
            this.pdf.setNativeProps({ page: prePage });
            this.setState({ page: prePage });
            // console.log(`prePage: ${prePage}`);
        }
    }

    nextPage = () => {
        if (this.pdf) {
            let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
            Reactotron.log("nextPage",nextPage)
            this.pdf.setNativeProps({ page: nextPage });
            this.setState({ page: nextPage });
            // console.log(`nextPage: ${nextPage}`);
        }
    }

    goFistPage() {
        this.setState({ page: 1 });
        this.pdf.setNativeProps({ page: 1 });
    }

    goLastPage() {
        let { pageCount } = this.state;
        this.pdf.setNativeProps({ page: pageCount });
        this.setState({ page: pageCount });
    }

    printDocument = (url) => {
        this.downloadFile(url, (res) => {
            RNPrint.print(res.path())
                .then((jobName) => {
                    // console.log(`Printing ${jobName} complete!`);
                }).catch(err => console.log(err))
        })
    }

    downloadPdf = (url) => {
        this.downloadFile(url, (res) => {
            // console.log(res.path());
            Toast.show(`file downloaded to ${res.path()}`, Toast.LONG);
        })
    }

    close = () => {
        let { context } = this.props;
        // console.log(context);
        context.setState({
            visible: false
        });

    }

    zoomIn() {
        let { scale, maxScale, zoomRange } = this.state;
        let temp = scale + zoomRange > maxScale ? maxScale : scale + zoomRange;
        this.setState({ scale: temp })
    }

    zoomOut() {
        let { scale, maxScale, zoomRange, minScale } = this.state;
        let temp = scale > minScale ? scale - zoomRange : minScale;
        this.setState({ scale: temp })
    }

    render() {
        let { visible, page, pageCount, scale } = this.state;
        let { pdfSource } = this.props;
        console.log(pdfSource);
        // let source = { uri: `file://${pdfSource}`, cache: true };
        let source = { uri: pdfSource, cache: true };

        return (
            <Modal style={{ flex: 1, backgroundColor: 'black' }} visible={visible}>
                <View style={styles.pdfHeaderBar}>
                    <View style={styles.leftControls}>
                        <TouchableOpacity style={styles.btn} onPress={() => this.close()}>
                            <Image style={styles.btnClose} source={close} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={page == 1} style={styles.btn} onPress={() => this.goFistPage()}>
                            <Image style={styles.arrowsIcon} source={firstPage} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={page == 1} style={styles.btn} onPress={() => this.prePage()}>
                            <Image style={styles.arrowsIcon} source={pageUpIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={page == pageCount} style={styles.btn} onPress={() => this.nextPage()}>
                            <Image style={styles.arrowsIcon} source={pageDownIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={page == pageCount} style={styles.btn} onPress={() => this.goLastPage()}>
                            <Image style={styles.arrowsIcon} source={lastPage} />
                        </TouchableOpacity>

                        <View style={styles.pageDetailsBox}>
                                <TextInput
                                    onSubmitEditing={Keyboard.dismiss} 
                                    style={styles.textInput}
                                    onChangeText={(text) => {
                                        text.length > 0 ? this.setState({ page: parseInt(text) }) : this.setState({ page: text })
                                    }}
                                    value={page.toString()} />
                            <View style={styles.totalPageBox}>
                                <Text style={styles.text}>of:</Text>
                                <Text style={styles.text}> {pageCount} </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.centerControls}>
                        <TouchableOpacity style={styles.zoomBtns} onPress={() => this.zoomOut()}>
                            <Text style={[styles.text, styles.zoomIcons]}>-</Text>
                        </TouchableOpacity>
                        <View style={[styles.btn, styles.zoomSegment]}>
                            <Text style={[styles.text, { fontSize: 18, color: 'white' }]}>|</Text>
                        </View>
                        <TouchableOpacity style={[styles.zoomBtns, { marginRight: 10 }]} onPress={() => this.zoomIn()}>
                            <Text style={[styles.text, styles.zoomIcons]}>+</Text>
                        </TouchableOpacity>
                        <View style={[styles.btn, { width: 80 }]}>
                            <Text style={[styles.text, { width: 80, fontSize: 14 }]}> Zoom</Text>
                        </View>
                    </View>

                    <View style={styles.leftControls}>
                        <TouchableOpacity style={styles.btn} onPress={() => this.printDocument(source.uri)}>
                            <Image style={styles.rightControlIcons} source={print} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => this.downloadPdf(source.uri)}>
                            <Image style={styles.rightControlIcons} source={download} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                    source={source}
                    page={1}
                    scale={scale}
                    fitWidth={true}
                    horizontal={false}
                    onLoadComplete={(pageCount) => {
                        this.setState({ pageCount: pageCount });
                        {/*console.log(`total page count: ${pageCount}`);*/ }
                    }}
                    onPageChanged={(page, pageCount) => {
                        this.setState({ page: page });
                        {/*console.log(`current page: ${page}`);*/ }
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    style={styles.pdf}
                    spacing={150}
                    />
            </Modal>
        )
    }


    downloadFile(url, callback) {
        RNFetchBlob
            .config({
                fileCache: true,
            })
            .fetch('GET', url)
            .then((res) => {
                callback(res);
            })
    }
}