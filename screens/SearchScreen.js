import React from 'react';
import { StyleSheet, Text, View,FlatList,TouchableOpacity,TextInput } from 'react-native';
import { version } from 'react/cjs/react.development';
import db from '../config'

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


    searchTransactions=async(text)=>{
      var enterText=text.split("")
      if(enterText[0].toUpperCase()==='B') {
          const quareey=await db.collection("transactions").
          where("bookId","==",text).
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
  componentDidMount=async()=>{
    const quareey=await db.collection("transactions").
    limit(15).
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
  render(){

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
      <TextInput style={styles.bar} placeholder='BooksID/StudentID' onChangeText={(text)=>{
             this.setState({
               search:text
             })
           }} />
           <TouchableOpacity
            onPress={()=>this.searchTransactions(this.state.search)}
            style={styles.searchButton}>
            <Text>Search</Text>
          </TouchableOpacity>
</View>
<FlatList 
data={this.state.allTransactions}
renderItem={({item})=>(
  <View style={{borderBottomWidth:2 }}>
    <Text>{'book id:'+item.bookId}</Text>
    <Text>{'student id:'+item.studentId}</Text>
    <Text>{'tanscation type:'+item.transactionType}</Text>
    <Text>{'date :'+item.date.toDate()}</Text>
  </View>
)}
keyExtractor={(item,index)=>index.toString()}
onEndReached={this.fetchMoreTransactions}
onEndReachedThreshold={0.7}
/>



    </View>
  );
}
}
const styles = StyleSheet.create({ container: { flex: 1, marginTop: 20 },
   searchBar:{ flexDirection:'row', height:40,
    width:'auto', borderWidth:0.5, alignItems:'center', backgroundColor:'grey', }, 
   bar:{ borderWidth:2, height:30, 
    width:300, paddingLeft:10, }, 
   searchButton:{ borderWidth:1, height:30, width:50, alignItems:'center', 
   justifyContent:'center', backgroundColor:'green' } 
  })
