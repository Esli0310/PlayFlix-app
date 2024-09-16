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
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

export default function Favorito() {
    let emptyFavorito = {
        id: null,
        usuarioId: null,
        contenidoId: null
    };

    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [selectedContenido, setSelectedContenido] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [contenidos, setContenidos] = useState([]);
    const [favorito, setFavorito] = useState(emptyFavorito);
    const [dialog, setDialog] = useState(false);
    const [deleteFavoritoDialog, setDeleteFavoritoDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const urlAPI = 'http://localhost:8080/api/favoritos';
    const userApiUrl = 'http://localhost:8080/api/usuarios';
    const contentApiUrl = 'http://localhost:8080/api/contenidos';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [favoritosRes, usuariosRes, contenidosRes] = await Promise.all([
                    axios.get(urlAPI),
                    axios.get(userApiUrl),
                    axios.get(contentApiUrl)
                ]);
                setFavoritos(favoritosRes.data);
                setUsuarios(usuariosRes.data);
                setContenidos(contenidosRes.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }

            getFavoritos();
            getUsuarios();
            getContenidos();
        };

        fetchData();
    }, []);

    const getFavoritos = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setFavorito(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getUsuarios = async () =>{
        try{
            const resp = await axios.get(userApiUrl);
            setUsuarios(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getContenidos = async () =>{
        try{
            const resp = await axios.get(contentApiUrl);
            setContenidos(resp.data)
        } catch (err) {
            console.log(err);
        }
    }
    
    const openNew = () => {
        setFavorito(emptyFavorito);
        setSelectedUsuario(null);
        setSelectedContenido(null);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteFavoritoDialog = () => {
        setDeleteFavoritoDialog(false);
    };

    const createFormData = () => {
        let formData = new FormData();
        formData.append("usuarioId", favorito.usuarioId);
        formData.append("contenidoId", favorito.contenidoId);
        return formData;
    };
    
    const saveOrUpdate = async () => {
        setSubmitted(true);
    
        if (favorito.usuarioId && favorito.contenidoId) {
            let _favoritos = [...favoritos];
            let _favorito = {...favorito};
    
            if (favorito.id == null) { // Agregando
                try {
                    const resp = await axios.post(urlAPI, _favorito)
                    console.log(resp)
                    if (resp.status === 201) {
                        const { message, favorito } = resp.data;
                        toast.current.show({ severity: 'success', summary: 'Favorito Agregado', detail: message, life: 3000 });
                        _favoritos.unshift(favorito);
                        setFavoritos(_favoritos);
                        hideDialog();
                        setFavorito(emptyFavorito);
                    }
                } catch (err) {
                    const message = err.response?.data?.message || 'Error desconocido';
                    if (err.response?.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            } else { // Actualizando
                try {
                    const resp = await axios.put(`${urlAPI}/${favorito.id}`, _favorito, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (resp.status === 202) {
                        const { message, favorito } = resp.data;
                        const index = _favoritos.findIndex(e => e.id === favorito.id);
                        _favoritos[index] = favorito;
    
                        toast.current.show({ severity: 'success', summary: 'Favorito Actualizado', detail: message, life: 3000 });
    
                        setFavoritos(_favoritos);
                        hideDialog();
                    }
                } catch (err) {
                    const message = err.response?.data?.message || 'Error desconocido';
                    if (err.response?.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            }
        }
    };
    

    const editFavorito = (favorito) => {
        setFavorito({ ...favorito });
        setDialog(true);
    };

    const confirmDeleteFavorito = (favorito) => {
        setFavorito(favorito);
        setDeleteFavoritoDialog(true);
    };

    const deleteFavorito = async () => {
        let _favoritos = favoritos.filter((val) => val.id !== favorito.id);
        try {
            const resp = await axios.delete(`${urlAPI}/${favorito.id}`);
            const { message } = resp.data;
            setFavoritos(_favoritos);
            setDeleteFavoritoDialog(false);
            setFavorito(emptyFavorito);
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: message, life: 3000 });
        } catch (err) {
            const { message } = err.response.data;
            if (err.response.status === 500) {
                setDeleteFavoritoDialog(false);
                setFavorito(emptyFavorito);
                toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
            }
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, field) => {
        const val = (e.target && e.target.value) || '';
        let _favorito = { ...favorito };

        _favorito[`${field}`] = val;

        setFavorito(_favorito);
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editFavorito(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteFavorito(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Favoritos</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar favorito..." />
            </IconField>
        </div>
    );

    const favoritoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveOrUpdate} />
        </React.Fragment>
    );

    const deleteFavoritoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteFavoritoDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteFavorito} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={favoritos} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 15]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} favoritos" globalFilter={globalFilter} header={header}>
                    <Column field="usuario.nombre" header="Usuario" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="contenido.nombre" header="Contenido" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Registro de favoritos" modal className="p-fluid" footer={favoritoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="usuario" className="font-bold">Usuario</label>
                    <Dropdown id="usuario" value={favorito.usuarioId} options={usuarios} onChange={(e) => onInputChange(e, 'usuarioId')} optionLabel="nombre" placeholder="Seleccionar usuario" required className={classNames({ 'p-invalid': submitted && !favorito.usuarioId })} />
                    {submitted && !favorito.usuarioId && <small className="p-error">Usuario es obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="contenido" className="font-bold">Contenido</label>
                    <Dropdown id="contenido" value={favorito.contenidoId} options={contenidos} onChange={(e) => onInputChange(e, 'contenidoId')} optionLabel="nombre" placeholder="Seleccionar contenido" required className={classNames({ 'p-invalid': submitted && !favorito.contenidoId })} />
                    {submitted && !favorito.contenidoId && <small className="p-error">Contenido es obligatorio.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteFavoritoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteFavoritoDialogFooter} onHide={hideDeleteFavoritoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {favorito && (
                        <span>
                            ¿Estás seguro de que quieres eliminar este favorito?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
