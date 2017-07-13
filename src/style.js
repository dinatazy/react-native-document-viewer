import {
    StyleSheet,
    Dimensions
} from 'react-native'

export const styles = StyleSheet.create({
    pdfHeaderBar: {
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 23,
        width: Dimensions.get('window').width
    },
    leftControls: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rightControls: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btn: {
        flexDirection: 'row',
        margin: 3,
        width: 30,
        // padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "blue",
    },
    btnDisabled: {
        flexDirection: 'row',
        margin: 3,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .6
    },
    icon: {
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
    },
    pageDetailsBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 3,
    },
    currentPageBox: {
        flexDirection: 'row',
        marginLeft: 3,
        marginRight: 3,
        width: 40,
        // padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        backgroundColor: 'grey'
    },
    textInput: {
        height: 20,
        width: 40,
        margin: 1,
        textAlign: 'center',
        color: 'white',
        fontSize: 15
    },
    text: {
        color: 'white',
    },
    btnText: {
        color: "#FFF",
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    }
});