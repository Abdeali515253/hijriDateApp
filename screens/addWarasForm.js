import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik } from 'formik';
import * as yup from 'yup';

const warasSchema = yup.object({
    day: yup.string().
        required().
        test('is-num-1-30', 'day must be a number 1 - 30', (val) => {
            return parseInt(val) < 31 && parseFloat(val) > 0;
        }),
    month: yup.string().
        required().
        test('is-num-1-12', 'month must be a number 1 - 12', (val) => {
            return parseInt(val) < 13 && parseFloat(val) > 0;
        }),
    name: yup.string()
            .required()
            .min(4),
})

export default function AddWarasForm( {  addWarasToMonth, currentMonth, currentDay } ) {
    const [warasAdded, setWarasAdded] = useState({day: '', name: '', month: ''})
    const [formSubmittedOnce, setformSubmittedOnce] = useState(false)

    


    return(
        <View style={globalStyles.container}>
            <Formik
                initialValues={{ day: currentDay, month: currentMonth, name: '' }}
                validationSchema={warasSchema}
                onSubmit={(values, actions) =>{
                    actions.resetForm();
                    setWarasAdded(values);
                    addWarasToMonth(values);
                    setformSubmittedOnce(true);
                }}
            >
                {(props) => (
                    <View>
                        <Text style={styles.heading}>Day</Text>
                        <TextInput 
                            style={globalStyles.input}
                            placeholder='waras day'
                            onChangeText={props.handleChange('day')}
                            value={props.values.day}
                            onBlur={props.handleBlur('day')}
                            keyboardType='numeric'
                        />
                        <Text style={globalStyles.errorText}>{ props.touched.day && props.errors.day }</Text>
                        <Text style={styles.heading}>Month</Text>
                        <TextInput 
                            style={globalStyles.input}
                            placeholder='waras month'
                            onChangeText={props.handleChange('month')}
                            value={props.values.month}
                            onBlur={props.handleBlur('month')}
                            keyboardType='numeric'
                        />
                        <Text style={globalStyles.errorText}>{ props.touched.month && props.errors.month }</Text>
                        <Text style={styles.heading}>Name</Text>
                        <TextInput 
                            style={globalStyles.input}
                            placeholder='name'
                            onChangeText={props.handleChange('name')}
                            onBlur={props.handleBlur('name')}
                            value={props.values.name}
                        />
                        <Text style={globalStyles.errorText}>{ props.touched.name && props.errors.name }</Text>

                        <Button title='add waras' color='pink' onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
            <View style = {styles.newWaras}>
                { formSubmittedOnce && <Text style={styles.recentlyAdded}>Day: { warasAdded.day }</Text>}
                { formSubmittedOnce && <Text style={styles.recentlyAdded}>Month: { warasAdded.month }</Text> }
                { formSubmittedOnce && <Text style={styles.recentlyAdded}>Name: { warasAdded.name }</Text>}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        marginLeft: 5,
        marginBottom: 5
    },
    recentlyAdded: {
        fontSize: 20,
        borderBottomWidth: 1
    },
    newWaras: {
        marginTop: 15,
        flex: 1,
    }
})