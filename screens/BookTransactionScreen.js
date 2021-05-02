import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput,Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase'
import db from "../config"
export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal',
        transactionMessage:''
        
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const buttonState=this.state.buttonState
      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
    
    }
    initiateBookIssue=async()=>{
      db.collection('transactions').add({
        "studentId":this.state.scannedStudentId,
        "bookId":this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':'Issue' 
      })
      db.collection('books').doc(this.state.scannedBookId).update({
        'bookAvailability':false
      })
      db.collection('students').doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
      })
      this.setState({
        scannedBookId:'',
        scannedStudentId:''
      })
    }
    initiateBookReturn=async()=>{
      db.collection('transactions').add({
        "studentId":this.state.scannedStudentId,
        "bookId":this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':'Return' 
      })
      db.collection('books').doc(this.state.scannedBookId).update({
        'bookAvailability':true
      })
      db.collection('students').doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
      })
      this.setState({
        scannedBookId:'',
        scannedStudentId:''
      })
    }

    handleTransaction=async()=>{
      var transactionMessage;
      db.collection('books').doc(this.state.scannedBookId).get()
      .then((doc)=>{
        var book = doc.data()
          if(book.bookAvailability){
            this.initiateBookIssue()
            transactionMessage='Book Issue'
            ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
          }
        else{
          this.initiateBookReturn()
          transactionMessage='Book Returned'
          ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        }
      })
      this.setState({
        transactionMessage:transactionMessage
      })
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <View>
            <Image source={require("../assets/booklogo.jpg")} style={{width:200, height:200}}/>
            <Text style={{textAlign:"center",fontSize: 30}}>
           wily 
         </Text> 
            </View>

           <View style={styles.inputView}> 
           <TextInput style={styles.inputBox} placeholder='BooksID' onChangeText={(text)=>{
             this.setState({
               scannedBookId:text
             })
           }} value={this.state.scannedBookId}/>
           <TouchableOpacity
            onPress={()=>this.getCameraPermissions('BookId')}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
            </View> 

            
           <View style={styles.inputView}> 
           <TextInput style={styles.inputBox} placeholder='studentID' onChangeText={(text)=>{
             this.setState({
               scannedStudentId:text
             })
           }} value={this.state.scannedStudentId}/>
           <TouchableOpacity
            onPress={()=>this.getCameraPermissions('StudentId')}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
            </View>
            <TouchableOpacity
            onPress={async()=>{await this.handleTransaction()}}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>submit</Text>
          </TouchableOpacity>
            </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({ 
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
     displayText:{ fontSize: 15, textDecorationLine: 'underline' },
      scanButton:{ backgroundColor: '#2196F3', padding: 10, margin: 10 }, 
      buttonText:{ fontSize: 15, textAlign: 'center', marginTop: 10 }, 
      inputView:{ flexDirection: 'row', margin: 20 },
       inputBox:{ width: 200, height: 40, borderWidth: 1.5, borderRightWidth: 0, fontSize: 20 },
        scanButton:{ backgroundColor: '#66BB6A', width: 50, borderWidth: 1.5, borderLeftWidth: 0 } ,
        submitButton:{ backgroundColor: '#FBC02D', width: 100, height:50 }, 
        submitButtonText:{ padding: 10, textAlign: 'center', fontSize: 20, fontWeight:"bold", color: 'white' },

      });