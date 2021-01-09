import React, { useState, useEffect } from "react";
import { Grid, TextField, withStyles, FormControl, InputLabel, Select, MenuItem, Button, FormHelperText } from "@material-ui/core";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../actions/dCandidate";
import { useToasts } from "react-toast-notifications";

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            minWidth: 230,
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 230,
    },
    smMargin: {
        margin: theme.spacing(1)
    }
})

const initialFieldValues = {
    fullName: '',
    mobile: '',
    email: '',
    dni: '',
    age: '',
    bloodGroup: '',
    address: '',
    country: ''
}

const DCandidateForm = ({ classes, ...props }) => {

    //toast msg.
    const { addToast } = useToasts()

    //validate()
    //validate({fullName:'jenny'})
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "Este campo es requerido."
        if ('mobile' in fieldValues)
            temp.mobile = fieldValues.mobile ? "" : "Este campo es requerido."
        if ('bloodGroup' in fieldValues)
            temp.bloodGroup = fieldValues.bloodGroup ? "" : "Este campo es requerido."
        if ('dni' in fieldValues)
            temp.dni = fieldValues.dni ? "" : "Este campo es requerido."
        if ('age' in fieldValues)
            temp.age = fieldValues.age ? "" : "Este campo es requerido."
        if ('address' in fieldValues)
            temp.address = fieldValues.address ? "" : "Este campo es requerido."
        if ('country' in fieldValues)
            temp.country = fieldValues.country ? "" : "Este campo es requerido."

        if ('email' in fieldValues)
            temp.email = (/^$|.+@.+..+/).test(fieldValues.email) ? "" : "El correo no es válido."
    
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, validate, props.setCurrentId)

    //material-ui select
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const onSuccess = () => {
                resetForm()
                addToast("Enviado satisfactoriamente", { appearance: 'success' })
            }
            if (props.currentId == 0)
                props.createDCandidate(values, onSuccess)
            else
                props.updateDCandidate(props.currentId, values, onSuccess)
        }
    }

    useEffect(() => {
        if (props.currentId != 0) {
            setValues({
                ...props.dCandidateList.find(x => x.id == props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])

    return (
        <form autoComplete="off" noValidate className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <TextField
                        name="fullName"
                        variant="outlined"
                        label="Nombre Completo"
                        value={values.fullName}
                        onChange={handleInputChange}
                        {...(errors.fullName && { error: true, helperText: errors.fullName })}
                    />
                    <TextField
                        name="mobile"
                        variant="outlined"
                        label="Celular"
                        value={values.mobile}
                        onChange={handleInputChange}
                        {...(errors.mobile && { error: true, helperText: errors.mobile })}
                    />
                    <TextField
                        name="email"
                        variant="outlined"
                        label="Email"
                        value={values.email}
                        onChange={handleInputChange}
                        {...(errors.email && { error: true, helperText: errors.email })}
                    />
                    <FormControl variant="outlined"
                        className={classes.formControl}
                        {...(errors.bloodGroup && { error: true })}
                    >
                        <InputLabel ref={inputLabel}>Grupo Sanguineo</InputLabel>
                        <Select
                            name="bloodGroup"
                            value={values.bloodGroup}
                            onChange={handleInputChange}
                            labelWidth={labelWidth}
                        >
                            <MenuItem value="">Seleccionar grupo sanguíneo</MenuItem>
                            <MenuItem value="A+">A +ve</MenuItem>
                            <MenuItem value="A-">A -ve</MenuItem>
                            <MenuItem value="B+">B +ve</MenuItem>
                            <MenuItem value="B-">B -ve</MenuItem>
                            <MenuItem value="AB+">AB +ve</MenuItem>
                            <MenuItem value="AB-">AB -ve</MenuItem>
                            <MenuItem value="O+">O +ve</MenuItem>
                            <MenuItem value="O-">O -ve</MenuItem>
                        </Select>
                        {errors.bloodGroup && <FormHelperText>{errors.bloodGroup}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>

                    <TextField
                        name="dni"
                        variant="outlined"
                        label="Dni"
                        value={values.dni}
                        onChange={handleInputChange}
                        {...(errors.dni && { error: true, helperText: errors.dni })}
                    />
                    <TextField
                        name="age"
                        variant="outlined"
                        label="Edad"
                        value={values.age}
                        onChange={handleInputChange}
                        {...(errors.age && { error: true, helperText: errors.age })}
                    />
                    <TextField
                        name="address"
                        variant="outlined"
                        label="Direccion"
                        value={values.address}
                        onChange={handleInputChange}
                        {...(errors.address && { error: true, helperText: errors.address })}
                    />
                    <TextField
                        name="country"
                        variant="outlined"
                        label="Pais"
                        value={values.country}
                        onChange={handleInputChange}
                        {...(errors.country && { error: true, helperText: errors.country })}
                    />
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.smMargin}
                        >
                            Enviar
                        </Button>
                        <Button
                            variant="contained"
                            className={classes.smMargin}
                            onClick={resetForm}
                        >
                            Limpiar
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
}


const mapStateToProps = state => ({
    dCandidateList: state.dCandidate.list
})

const mapActionToProps = {
    createDCandidate: actions.create,
    updateDCandidate: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DCandidateForm));