
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import axios from 'axios';

export default function Contenidos() {
let emptyContenido = {
    id:null,
    fechaLanzamiento: '',
    nombre: '',
    descripcion: '',
    duracion: '',
    imagen: null
    }



    const [layout, setLayout] = useState('grid');
    const [contenido, setContenido] = useState(null);
    const [contenidos, setContenidos] = useState([]);
    const API = 'http://localhost:8080/api/contenidos'

    useEffect(() => {
        // contenidoService.getcontenidos().then((data) => setcontenidos(data.slice(0, 12)));
        getContenidos();
    }, []);

    // const getSeverity = (contenido) => {
    //     switch (contenido.inventoryStatus) {
    //         case 'INSTOCK':
    //             return 'success';

    //         case 'LOWSTOCK':
    //             return 'warning';

    //         case 'OUTOFSTOCK':
    //             return 'danger';

    //         default:
    //             return null;
    //     }
    // };

    const getContenidos = async () => {
        try{
            const resp = await axios.get(API);
            setContenidos(resp.data);
        }catch (err){
            console.log(err);
        }
    }
    console.log(contenidos)

    
    
    




    const listItem = (contenido, index) => {
        return (
            <div className="col-12" key={contenido.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/contenido/${contenido.image}`} alt={contenido.name} /> */}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{contenido.nombre}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-calendar"></i>
                                    <span className="font-semibold">{contenido.fechaLanzamiento}</span>
                                </span>
                                {/* <Tag value={contenido.duracion} severity={getSeverity(contenido)}></Tag> */}
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">Duracion: {contenido.duracion}</span>
                            {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={contenido.inventoryStatus === 'OUTOFSTOCK'}></Button> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (contenido) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={contenido.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-calendar"></i>
                            <span className="font-semibold">{contenido.fechaLanzamiento}</span>
                        </div>
                        {/* <Tag value={contenido.duracion} severity={getSeverity(contenido)}></Tag> */}
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {/* <img className="w-9 shadow-2 border-round" src={`https://primefaces.org/cdn/primereact/images/contenido/${contenido.image}`} alt={contenido.name} /> */}
                        <div className="text-2xl font-bold">{contenido.nombre}</div>
                        {/* <Rating value={contenido.rating} readOnly cancel={false}></Rating> */}
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">Duracion: {contenido.duracion}</span>
                        {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={contenido.inventoryStatus === 'OUTOFSTOCK'}></Button> */}
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (contenido, layout, index) => {
        if (!contenido) {
            return;
        }

        if (layout === 'list') return listItem(contenido, index);
        else if (layout === 'grid') return gridItem(contenido);
    };

    const listTemplate = (contenidos, layout) => {
        return <div className="grid grid-nogutter">{contenidos.map((contenido, index) => itemTemplate(contenido, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        
        <div className="card">
            <DataView value={contenidos} listTemplate={listTemplate} layout={layout} header={header()} />
        </div>
    )
}