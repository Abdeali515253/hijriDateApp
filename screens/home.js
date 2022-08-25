import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal,TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/header';
import { hijriDate } from '../hijriDate';
import WeekDays from '../components/weekDays';
import MonthDates from '../components/monthDates';
import WarasList from '../components/warasList';
import AddWarasForm from './addWarasForm';
import Store from 'react-native-store';

const DB = {
  'warasDates' : Store.model('warasDates')
}


export default function Home() {

  const [today, setToday] = useState(new hijriDate(new Date()));
  const [dates, setDates] = useState();
  const [month, setMonth] = useState(today.hm);
  const [year, setYear] = useState(today.hy);
  const [modalAddWaras, setModalAddWaras] = useState(false)
  const [warasList, setWarasList] = useState([])
  const [daySelected, setDaySelected] = useState('')

  useEffect(() => {
    
    const daysInCurrentMonth = getNumDaysInMonth(month);
    let allDates = [];
    const firstDayOfTheMonth = hijriDate.getHijriDate(year, month+1, 1);
    for(let i = 0 ; i < firstDayOfTheMonth.dayOfWeek; i++){
      allDates = [...allDates, {day: '',
        month: '', year: ''}]
    }
    for(let i = 1; i<= daysInCurrentMonth; i++){
      if(i<10) day = '0' + i.toString();
      else day = i.toString();
      allDates = [...allDates, {day: day,
         month: month.toString(), year: year.toString()}]
    }

    let lastDayOfMonth = firstDayOfTheMonth.dayOfWeek;
    if(daysInCurrentMonth == 30) {
      lastDayOfMonth++;
    }
    if(lastDayOfMonth > 6) lastDayOfMonth = 0;
    let daysLeft = 6-lastDayOfMonth;

    for(let i = 0 ; i < daysLeft; i++){
      allDates = [...allDates, {day: '',
        month: '', year: ''}]
    }
    setDates(allDates);

    DB.warasDates.find({
      where: {
        month: month
      },
      order: {
        day: 'ASC',
      }
    }).then(resp => {
      if(resp != null){
        setWarasList(resp);
      } else{
        setWarasList([])
      }
    })

  }, [month, year]);


  const getNumDaysInMonth = (monthNumber) => {
    if(year%3 === 2 && monthNumber+1 === 12) return 30;
    else if((monthNumber+1)%2 === 0) return 29;
    else return 30;
  }

  const getMonthName = (monthNumber) => {
    return hijriDate.iMonthNames[monthNumber];
  }

  const moveForward = () => {
    if(month === 11){
      setMonth(0);
      setYear(prevYear => prevYear+1);
    }
    else {
      setMonth(prevMonth => prevMonth+1);
    }
  }

  const moveBackward = () => {
    if(month === 0){
      setMonth(11);
      setYear(prevYear => prevYear-1);
    }
    else{
      setMonth(prevMonth => prevMonth-1);
    }
  }

  const addWarasToMonth = (warasToAdd) => {
    
    DB.warasDates.add({
      day: warasToAdd.day,
      month: warasToAdd.month-1,
      name: warasToAdd.name,
    }).then(resp => {
      if(month != resp.month) return
      const pos = warasList.findIndex((waras) => {return parseInt(resp.day) <= parseInt(waras.day)});
      if(pos === -1){
        setWarasList(prevList => {
          return [
            ...prevList,
            resp
          ]
        })
      } else {
        setWarasList(prevList => {
          return [
            ...prevList.slice(0, pos),
            resp,
            ...prevList.slice(pos),
          ]
        })
      }
      })
    }

    const removeWarasFromMonth = (warasToRemove) => {
      const pos = warasList.findIndex((waras) => {return warasToRemove._id === waras._id});
      setWarasList(prevList => {
        return [
          ...prevList.slice(0, pos),
          ...prevList.slice(pos+1),
        ]
      })
      DB.warasDates.remove({
        where: {
          _id: warasToRemove._id
        }
    })
  }
  
  const openForm = (day) => {
    setModalAddWaras(true)
    setDaySelected(day)
  }

  return (
    <View style={styles.container}>
      <Header
        moveBackward={moveBackward} 
        moveForward={moveForward} 
        getMonthName={getMonthName} 
        month={month}
        year={year}
      />

      <Text>Today: {today.printPretty()}</Text>
      
      <WeekDays />

      <MonthDates
        dates={dates} 
        warasList={warasList}
        today={today}
        openForm={openForm}
      />   

      <MaterialIcons 
          name='add'
          size={24}
          style={styles.modalToggle}
          onPress={() => openForm('')}
      />
      
      <Modal visible={modalAddWaras}  animationType='slide'>
        <View style={styles.modalContent}>
          <MaterialIcons 
              style={styles.modalClose}
              statusBarTranslucent={true}
              name='close'
              size={24}
              onPress={() => setModalAddWaras(false)}
          />
          
          <AddWarasForm 
            addWarasToMonth={addWarasToMonth}
            currentMonth={(month+1).toString()}
            currentDay={daySelected}
          />
        </View>
      </Modal>


      


      <WarasList 
        warasList={warasList}
        handlePress={removeWarasFromMonth}
      />
        
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
  },
  modalToggle: {
    width: 50,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 10,
  },
  modalClose: {
    width: 50,
    height: 50,
    textAlignVertical: 'center',
    marginLeft: 20,
  },
});
