import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

const emptyComentario = {
    id: null,
    fecha: null,
    opinion: '',
    usuarioId: null,
    contenidoId: null
};
export default function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [contenidos, setContenidos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedComentario, setSelectedComentario] = useState(emptyComentario);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fecha, setFecha] = useState(null);
    const [opinion, setOpinion] = useState('');
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [selectedContenido, setSelectedContenido] = useState(null);
    const toast = useRef(null);

    const apiUrl = 'http://localhost:8080/api/comentarios';
    const contentApiUrl = 'http://localhost:8080/api/contenidos';
    const userApiUrl = 'http://localhost:8080/api/usuarios';
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [comentariosRes, contenidosRes, usuariosRes] = await Promise.all([
                    axios.get(apiUrl),
                    axios.get(contentApiUrl),
                    axios.get(userApiUrl)
                ]);
                setComentarios(comentariosRes.data);
                setContenidos(contenidosRes.data);
                setUsuarios(usuariosRes.data);
            } catch (error) {
                if (error.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error fetching data:', {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    });
                } else if (error.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error fetching data:', {
                        request: error.request
                    });
                } else {
                    // Ocurrió un error al configurar la solicitud
                    console.error('Error fetching data:', {
                        message: error.message
                    });
                }
            }
        };
    
        fetchData();
    }, []);
    


    const openNewComentarioDialog = () => {
        setSelectedComentario(emptyComentario);
        setDialogVisible(true);
    };
    
    const hideComentarioDialog = () => {
        setDialogVisible(false);
        setSubmitted(false);
    };

    
    const saveComentario = async () => {
        setSubmitted(true);
    
        // Validación básica
        if (opinion.trim() && selectedUsuario && selectedContenido) {
            const comentarioData = {
                fecha: fecha || null,
                opinion,
                usuarioId: selectedUsuario.id,
                contenidoId: selectedContenido.id
            };
    
            try {
                let response;
                if (selectedComentario.id === null) {
                    // Guardar un nuevo comentario
                    response = await axios.post(apiUrl, comentarioData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const { message, comentario } = response.data;
                    if (response.status === 201) {
                        toast.current.show({ severity: 'success', summary: 'Comentario agregado', detail: message, life: 3000 });
                        setComentarios([comentario, ...comentarios]); // Agrega el nuevo comentario al principio
                    }
                } else {
                    // Actualizar un comentario existente
                    response = await axios.put(`${apiUrl}/${selectedComentario.id}`, comentarioData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const { message, comentario } = response.data;
                    if (response.status === 202) {
                        toast.current.show({ severity: 'success', summary: 'Comentario actualizado', detail: message, life: 3000 });
                        setComentarios(comentarios.map(c => (c.id === comentario.id ? comentario : c))); // Actualiza el comentario en la lista
                    }
                }
    
                // Refrescar los comentarios
                // const { data } = await axios.get(apiUrl);
                // setComentarios(data);
    
                hideComentarioDialog(); // Ocultar el diálogo
            } catch (error) {
                console.error('Error saving comment:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el comentario', life: 3000 });
            }
        }
    };
    
    

    
    const deleteComentario = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            toast.current.show({ severity: 'success', summary: 'Comentario eliminado', life: 3000 });
            setComentarios(comentarios.filter(comentario => comentario.id !== id));
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el comentario', life: 3000 });
        }
    };

    // Plantilla para las acciones de la tabla
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteComentario(rowData.id)} />
            </React.Fragment>
        );
    };
    /*
    const editComentario = (comentario) => {
        setSelectedComentarios(comentario);
        setDate(new Date(comentario.date));
        setOpinion(comentario.opinion);
        setSelectedUsuario(usuarios.find(usuarios => usuarios.id === comentario.usuarioId));
        setSelectedContenido(contents.find(contenido => contenido.id === comentario.contenidoId));
        setDialogVisible(true);
    };
    */
    const comentarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideComentarioDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveComentario} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="p-mt-5">
                <div className="p-mb-4"></div>
                <Button label="Nuevo comentario" className="flex flex-wrap gap-2" icon="pi pi-plus" onClick={openNewComentarioDialog} />
            </div>

        
            <Toast ref={toast} />
            <div className="card p-mt-5">
                
                <DataTable value={comentarios} paginator rows={10} rowsPerPageOptions={[5, 10, 15]} dataKey="id">
                <Column field="fecha" header="Fecha" body={(rowData) => {
            // Asegúrate de que rowData.fecha esté en un formato que se pueda convertir a Date
            const fecha = new Date(rowData.fecha);
            return fecha.toLocaleDateString(); // Cambia el formato según tus necesidades
                }} />
                    <Column field="opinion" header="Opinion" />
                    <Column field="usuario.nombre" header="Usuario" />
                    <Column field="contenido.nombre" header="Contenido" />
                    <Column body={actionBodyTemplate} exportable={false} />
                </DataTable>
            </div>

            <Dialog visible={dialogVisible} style={{ width: '50vw' }} header={selectedComentario ? 'Agregar comentario' : 'Nuevo Comentario'} modal footer={comentarioDialogFooter} onHide={hideComentarioDialog}>
                <div className="field">
                    <label htmlFor="fecha" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>Fecha</label>
                    <Calendar id="fecha" value={fecha} onChange={(e) => setFecha(e.value)} showIcon />
                </div>
                <div className="field" style={{fontWeight: 'bold', marginBottom: '1rem' }}>
                    <label htmlFor="opinion" style={{ display: 'block', marginBottom: '0.5rem' }}>Opinion</label>
                    <InputTextarea id="opinion" value={opinion} onChange={(e) => setOpinion(e.target.value)} rows={5} autoResize style={{ padding: '0.75rem', border: '1px solid #d0d0d0', width:'500px'}}/>
                </div>
                <div style={{display:'flex', gap:'4rem', alignItems: 'flex-start', flex: '1', marginRight:'5rem'}}>
                    <div className="p-mr-3 p-w-50">
                        <label htmlFor="usuario" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Usuario</label>
                        <Dropdown id="usuario" value={selectedUsuario} options={usuarios} optionLabel="nombre" onChange={(e) => setSelectedUsuario(e.value)} placeholder="Seleccionar Usuario" />
                    </div>
                    <div className="p-w-50">
                        <label htmlFor="contenido" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Contenido</label>
                        <Dropdown id="contenido" value={selectedContenido} options={contenidos} optionLabel="nombre" onChange={(e) => setSelectedContenido(e.value)} placeholder="Seleccinar Contenido" />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
