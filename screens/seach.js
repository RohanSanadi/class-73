import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SearchScreen extends React.Component {
    constructor(props){
        super(props)
        this.state={allTransactions:[],
        lastVisibleTransaction:null,
        search:''}
    }
    fetchMoreTransactions=async()=>{
        var text=this.state.search.toUpperCase()
        var enterText=text.split("")
        if(enterText[0].toUpperCase()==='B') {
            const quareey=await db.collection("transactions").
            where("bookId","==",text).
            startAfter(this.state.lastVisibleTransaction).
            limit(10).
            get()
            quareey.docs.map((
                doc
            )=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }else if(enterText[0].toUpperCase()==='S') {
            const quareey=await db.collection("transactions").
            where("studentId","==",text).
            startAfter(this.state.lastVisibleTransaction).
            limit(10).
            get()
            quareey.docs.map((
                doc
            )=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }
    }
  render(){
  return (
    <View style={styles.container}>
      <Text> search books </Text>
      <StatusBar style="auto" />
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

