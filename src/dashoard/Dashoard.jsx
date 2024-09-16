import React from 'react'

const Dashboard = () => {
    return (
        <div className='p-6'>
            <h2 className='text-3xl font-semibold mb-4'></h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex justify-center items-center'>
                <div className='bg-white p-4 rounded shadow-md'>
                    <h3 className='text-xl font-bold mb-2'>Peliculas</h3>
                    <p className='text-gray-700'>230 Peliculas</p>
                </div>
                <div className='bg-white p-4 rounded shadow-md'>
                    <h3 className='text-xl font-bold mb-2'>Usuarios</h3>
                    <p className='text-gray-700'>50 Usuarios</p>
                </div>
                <div className='bg-white p-4 rounded shadow-md'>
                    <h3 className='text-xl font-bold mb-2'>Favoritos</h3>
                    <p className='text-gray-700'>15Favoritos</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard