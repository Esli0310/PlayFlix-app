import React, { useState, useEffect, useRef } from 'react'; 
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export default function Clasificacion() {
    let emptyClasificacion = {
        id: null,
        nombre: '',
    };

    const [clasificaciones, setClasificaciones] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [deleteClasificacionDialog, setDeleteClasificacionDialog] = useState(false);
    const [clasificacion, setClasificacion] = useState(emptyClasificacion);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const urlAPI = 'http://localhost:8080/api/clasificaciones';

    useEffect(() => {
        getClasificaciones();
    }, []);

    const getClasificaciones = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setClasificaciones(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const openNew = () => {
        setClasificacion(emptyClasificacion);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteClasificacionDialog = () => {
        setDeleteClasificacionDialog(false);
    };

    const saveOrUpdate = async () => {
        setSubmitted(true);

        if (clasificacion.nombre.trim()) {
            let _clasificaciones = [...clasificaciones];
            let _clasificacion = { ...clasificacion };

            if (_clasificacion.id == null) {
                //logica para guardar una clasificacion
                try {
                    const resp = await axios.post(urlAPI, _clasificacion);
                    console.log(resp);
                    const {message, clasificacion} = resp.data;
                    if (resp.status === 201) {
                        toast.current.show({ severity: 'success', summary: 'Clasificación Registrada', detail: message, life: 3000 });
                        _clasificaciones.unshift(clasificacion)
                        setClasificaciones(_clasificaciones);
                        setDialog(false);
                        setClasificacion(emptyClasificacion);
                    }
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            } else {
                //logica para actualizar una especialidad
                try {
                    const resp = await axios.put(urlAPI + `/${clasificacion.id}`, _clasificacion);
                    console.log(resp);
                    if (resp.status === 202) {

                        const {message, clasificacion} = resp.data;
                        const index = _clasificaciones.findIndex(e => e.id === clasificacion.id)
                        _clasificaciones[index] = clasificacion;

                        toast.current.show({ severity: 'success', summary: 'Clasificación Actualizada', detail: message, life: 3000 });

                        setClasificaciones(_clasificaciones);
                        setDialog(false);
                        setClasificacion(emptyClasificacion);
                    }
                    
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            }
        }
    };

    const editClasificacion = (clasificacion) => {
        setClasificacion({ ...clasificacion });
        setDialog(true);
    };

    const confirmDeleteClasificaciones = (clasificacion) => {
        setClasificacion(clasificacion);
        setDeleteClasificacionDialog(true);
    };

    const deleteClasificacion = async () => {
      let _clasificaciones = clasificaciones.filter((val) => val.id !== clasificacion.id);
    try{
              const resp = await axios.delete(`${urlAPI}`/`${clasificacion.id}`);
              const {message} = resp.data;
              setClasificaciones(_clasificaciones);
              setDeleteClasificacionDialog(false);
              setClasificacion(emptyClasificacion);
              toast.current.show({ severity: 'success', summary: 'Eliminado', detail: message, life: 3000 });
    } catch (err) {
              const {message, error} = err.response.data;
              if (err.response.status === 500) {
                  setDeleteClasificacionDialog(false);
                  setClasificacion(emptyClasificacion);
                  toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
              } else {
                console.log(error);
           }
       
        }        
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || '';
        let _clasificacion = { ...clasificacion };

        _clasificacion[`${nombre}`] = val;

        setClasificacion(_clasificacion);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editClasificacion(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteClasificaciones(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Clasificaciones</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar clasificacion..." />
            </IconField>
        </div>
    );
    const ClasificacionDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveOrUpdate} />
        </React.Fragment>
    );
    const deleteClasificaionDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteClasificacionDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteClasificacion} />
        </React.Fragment>
    );
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={clasificaciones}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 15]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clasificaciones" globalFilter={globalFilter} header={header}>
                    <Column field="nombre" header="Clasificacion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Registro de clasificaciones" modal className="p-fluid" footer={ClasificacionDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={clasificacion.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !clasificacion.nombre })} />
                    {submitted && !clasificacion.nombre && <small className="p-error">Nombre es obligatorio.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteClasificacionDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteClasificaionDialogFooter} onHide={hideDeleteClasificacionDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {clasificacion && (
                        <span>
                            Estas seguro de que quieres eliminar esta clasificación <b>{clasificacion.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}