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
import { Password } from 'primereact/password';

export default function Usuario() {
    let emptyUsuario = {
        id: null,
        nombre: '',
        email: '',
        contrasena: ''
    };

    const [usuarios, setUsuarios] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [usuario, setUsuario] = useState(emptyUsuario);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const urlAPI = 'http://localhost:8080/api/usuarios';

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setUsuarios(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const openNew = () => {
        setUsuario(emptyUsuario);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const saveOrUpdate = async () => {
        setSubmitted(true);

        if (usuario.nombre.trim()) {
            let _usuarios = [...usuarios];
            let _usuario = { ...usuario };

            if (_usuario.id == null) {
                //logica para guardar una usuario
                try {
                    const resp = await axios.post(urlAPI, _usuario);
                    console.log(resp);
                    const {message, usuario} = resp.data;
                    if (resp.status === 201) {
                        toast.current.show({ severity: 'success', summary: 'Usuario Registrado', detail: message, life: 3000 });
                        _usuarios.unshift(usuario)
                        setUsuarios(_usuarios);
                        setDialog(false);
                        setUsuario(emptyUsuario);
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
                //logica para actualizar un usuario
                try {
                    const resp = await axios.put(urlAPI + `/${usuario.id}`, _usuario);
                    console.log(resp);
                    if (resp.status === 202) {

                        const {message, usuario} = resp.data;
                        const index = _usuarios.findIndex(e => e.id === usuario.id)
                        _usuarios[index] = usuario;

                        toast.current.show({ severity: 'success', summary: 'Usuario Actualizado', detail: message, life: 3000 });

                        setUsuarios(_usuarios);
                        setDialog(false);
                        setUsuario(emptyUsuario);
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

    const editUsuario = (usuario) => {
        setUsuario({ ...usuario });
        setDialog(true);
    };

    const confirmDeleteUsuarios = (usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = async () => {
      let _usuarios = usuarios.filter((val) => val.id !== usuario.id);
    try{
              const resp = await axios.delete(`${urlAPI}`/`${usuario.id}`);
              const {message} = resp.data;
              setUsuarios(_usuarios);
              setDeleteUsuarioDialog(false);
              setUsuario(emptyUsuario);
              toast.current.show({ severity: 'success', summary: 'Eliminado', detail: message, life: 3000 });
    } catch (err) {
              const {message, error} = err.response.data;
              if (err.response.status === 500) {
                  setDeleteUsuarioDialog(false);
                  setUsuario(emptyUsuario);
                  toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
              } else {
                console.log(error)
           }
       
        }        
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };

        _usuario[`${nombre}`] = val;

        setUsuario(_usuario);
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuarios(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar usuario..." />
            </IconField>
        </div>
    );
    const UsuarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveOrUpdate} />
        </React.Fragment>
    );
    const deleteClasificaionDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsuarioDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </React.Fragment>
    );
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={usuarios}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 15]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} usuarioes" globalFilter={globalFilter} header={header}>
                    <Column field="nombre" header="Usuario" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Registro de usuarioes" modal className="p-fluid" footer={UsuarioDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={usuario.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.nombre })} />
                    {submitted && !usuario.nombre && <small className="p-error">Nombre es obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.email })} />
                    {submitted && !usuario.email && <small className="p-error">El email es obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Contraseña
                    </label>
                    <Password id="constrasena" value={usuario.contrasena} onChange={(e) => onInputChange(e, 'contrasena')} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.contrasena })} />
                    {submitted && !usuario.contrasena && <small className="p-error">La contraseña es obligatoria.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteUsuarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteClasificaionDialogFooter} onHide={hideDeleteUsuarioDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            Estas seguro de que quieres eliminar este usuario <b>{usuario.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}