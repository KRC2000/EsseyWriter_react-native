import React, { useRef, useState, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View, Dimensions, Pressable, ScrollView, Alert, Animated, Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

import {initConnection, getProducts, endConnection, getSubscriptions} from 'react-native-iap';


import FadeOutNotification from './FadeOutNotification';

async function do_request(queryText) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": "Write an essey about" + queryText + ". Only include essay text in the output" }]
    }),
  })

  const json = await response.json();
  return json.choices[0].message.content;
}

async function do_request_stub(queryText) {
  return "This is a temporary stubbed output";
}

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export default function App() {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [isResultLoading, setIsResultLoading] = useState(false);

  
  const notif_copy = useRef(null);
  const notif_submit = useRef(null);
  const notif_clear = useRef(null);
  
  const [products, setProducts] = useState({});
  
  const items = Platform.select({
    ios: [],
    android: ["essay_unit_0"]
  })

  useEffect(() => {

    initConnection().then(() =>
    {
      getProducts({items}).then(() =>
      {
        console.log(items);
      })
    })
    // initConnection().catch(() => 
      // {
      //   console.log("error connecting to store...");
      // }).then(() => 
      // {
      //   getSubscriptions(items).catch(() => 
      //   {
      //     console.log("error finding items");
      //   }).then((res) => 
      //   {
      //     setProducts(res);
      //     console.log(res);
      //   })
      // })



  }, []);


  function printResult() {
    //do_request(query).then((result) => { setIsResultLoading(false); setQueryResult(result.trim()); })
    do_request_stub(query).then((result) => { setIsResultLoading(false); setQueryResult(result.trim()); })
    console.log("its done");
  }

  const cpResultToClipboard = async () => {
    Clipboard.setString(queryResult);
  };

  return (
    <View>
      
      {/* {products.map((p) => (
          <Button
            key={p["productId"]}
            title={`Purchase ${p["title"]}`}
          />
        ))} */}

      <ScrollView>
        <LinearGradient style={{ minHeight: windowDimensions.height, minWidth: windowDimensions.width }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          colors={['rgb(222, 184, 135)', 'rgb(95, 158, 160)']}>
          <View style={styles.container}>
            <Text style={{
              width: "100%",
              textShadowRadius: 30,
              textAlign: 'center',
              fontSize: 40
            }}>Write some dumb shit here</Text>
            <TextInput style={{
              textAlign: 'center',
              marginTop: 50,
              minHeight: 50,
              fontSize: 25,
              width: "70%",
              borderColor: 'black',
              borderRadius: 15,
              borderWidth: 3
            }}
              placeholder="Type here"
              multiline={true}
              onChangeText={queryText => setQuery(queryText)}
            />
            {isResultLoading &&
              <Image source={require('./assets/spin.gif')}
                style={{
                  marginTop: 10,
                  width: 350, height: 350
                }} />}
            <View style={{ flexDirection: 'row' }}>
              {isResultLoading != true &&
                <Pressable style={{ flex: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}
                  onPress={press => { notif_submit.current.run(); setIsResultLoading(true); printResult(); }}>
                  <Text style={{
                    fontSize: 20,
                    textDecorationLine: 'underline',
                  }}>Submit</Text>
                </Pressable>}
              {queryResult.length > 0 && isResultLoading == false &&
                <Pressable style={{ flex: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}
                  onPress={press => { notif_copy.current.run(); cpResultToClipboard(); }}>
                  <Text style={{
                    fontSize: 20,
                    textDecorationLine: 'underline',
                  }}>Copy</Text>
                </Pressable>}
              {queryResult.length > 0 && isResultLoading != true &&
                <Pressable style={{ flex: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}
                  onPress={clear => { notif_clear.current.run(); setQueryResult(''); }}>
                  <Text style={{
                    fontSize: 20,
                    textDecorationLine: 'underline',
                  }}>Clear</Text>
                </Pressable>}
            </View>
            {queryResult.length > 0 && isResultLoading != true &&
              <Text style={{
                fontSize: 25,
                width: "90%",
                borderColor: 'black',
                borderRadius: 15,
                borderWidth: 3,
                paddingHorizontal: 15,
              }}
              >{queryResult}
              </Text>
            }
          </View>
        </LinearGradient>
      </ScrollView>


      <FadeOutNotification text="Submited" ref={notif_submit} style={{
        alignSelf: 'center'
      }} />
      <FadeOutNotification text="Copied" ref={notif_copy} style={{
        alignSelf: 'center'
      }} />
      <FadeOutNotification text="Cleared" ref={notif_clear} style={{
        alignSelf: 'center'
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: "35%"
  },
  element: {
    backgroundColor: 'rgb(0, 100, 60)',
    borderRadius: 30,
    borderWidth: 5
  }
});
