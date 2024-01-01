import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WebView from "react-native-webview";
import Modal from "react-native-modal";
import IconButton from "./IconButton";
function VNPAY({ amount, closeModal, isVisible }) {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState("vnpay.com.vn");
  const [webviewKey, setWebviewKey] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      if (webViewRef.current) {
        const zoomScript = `
          var meta = document.createElement('meta');
          meta.setAttribute('name', 'viewport');
          meta.setAttribute('content', 'width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=0');
          document.getElementsByTagName('head')[0].appendChild(meta);
          true
        `;
        webViewRef.current.injectJavaScript(zoomScript);
      }
    }, 300);
  }, [currentUrl, webViewRef.current]);
  const handleMessage = (event) => {
    const response = event.nativeEvent.data;
    // Do something with the response from the WebView
    console.log("Response:", response);
  };
  const handleBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();

      return true;
    }
    return false;
  };
  const handleForwardPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goForward();
      return true;
    }
    return false;
  };
  const reload = () => {
    setWebviewKey((curr) => curr + 1);
  };
  const { width, height } = Dimensions.get("window");
  function handleWebViewNavigationStateChange(navState) {
    const { url } = navState;
    if (!url) return;
    if (url.includes("vnp_ResponseCode=00")) {
      // this.webview.stopLoading();
      console.log("Success");
      closeModal("success");

      // setTimeout(() => {
      //   closeModal("success");
      // }, 1000);
    }
    if (url.includes("vnp_ResponseCode=24")) {
      // this.webview.stopLoading();
      console.log("Fail");
      closeModal("fail");
      // setTimeout(() => {
      //   closeModal("fail");
      // }, 1000);
    }
  }
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.1}
      deviceWidth={0.1 * width}
      deviceHeight={height}
    >
      <View style={{ flex: 1, paddingTop: 40 }}>
        <View style={styles.subRoot}>
          <View style={styles.buttonContainer}>
            <IconButton
              color={"black"}
              icon={"close"}
              size={30}
              onPress={() => {
                closeModal("exit");
              }}
            />
            <View style={{ marginLeft: -60 }}>
              <IconButton
                color={"black"}
                icon={"chevron-back"}
                size={30}
                onPress={handleBackPress}
              />
            </View>

            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                textAlign: "center",
                marginLeft: -20,
                width: 150,
              }}
            >
              {currentUrl}
            </Text>
            <IconButton
              color={"black"}
              icon={"ios-chevron-forward-outline"}
              size={30}
              onPress={handleForwardPress}
            />
          </View>
          <WebView
            key={webviewKey}
            ref={webViewRef}
            source={{
              uri: `https://payment-stripe-vnpay.onrender.com/payment/create_payment_url?amount=${amount}`,
            }}
            onNavigationStateChange={(navState) => {
              if (navState.canGoBack) {
                // WebView can go back, handle accordingly
                setCurrentUrl(navState.url);
              } else {
                // WebView cannot go back, return to your app
              }
              handleWebViewNavigationStateChange(navState);
            }}
            onContentProcessDidTerminate={reload}
          />
        </View>
      </View>
    </Modal>
  );
}
export default VNPAY;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "gray",
  },
  subRoot: {
    // alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    zIndex: 1,
  },
});
