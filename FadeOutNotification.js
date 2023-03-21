import { forwardRef, useState, useImperativeHandle } from 'react';
import { View, Animated } from 'react-native';

// To use this component: copy this file to your project root folder and add 
// import FadeOutNotification from './FadeOutNotification';
// 
// Add const notification = useRef(null), add ref={notification}
// to the <FadeOutNotification> element that will be referenced.
// Then you can call run() method that will execute animation once by calling:
// notification.current.run();
// You can set text using "text" property
// Set text style using "textStyle" property, for example:
// <FadeOutNotification textStyle={{ fontSize: 32}} />
const FadeOutNotification = forwardRef((props, ref) => {
  const fadingOpacity = useState(new Animated.Value(1))[0]; 
  const fadingPosition = useState(new Animated.Value(0))[0]; 
  const [processing, setProcessing] = useState(false);

  useImperativeHandle(ref, () => ({
    run: () => {
      fadingOpacity.resetAnimation();
      fadingPosition.resetAnimation();
      setProcessing(true);
    }
  }));
  
  if (processing){
    Animated.timing(fadingOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => { setProcessing(false); }); 
    Animated.timing(fadingPosition, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }
    

  const defaultTextStyle={
    fontSize: 28
  }

  const animLayerStyle={
    marginTop: fadingPosition
  }

  const defaultViewStyle={
    position: 'absolute'
  }

    return (
      <View style={[defaultViewStyle, props.style]}>
        {processing && 
        <Animated.View style={{opacity: fadingOpacity}}>
          <Animated.Text style={[defaultTextStyle, props.textStyle, animLayerStyle]}>{props.text ? props.text : "Hi! I am empty popup!"}</Animated.Text>
        </Animated.View>}
      </View>
    );
});

export default FadeOutNotification;