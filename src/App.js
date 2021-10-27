
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import React, { useState, useEffect } from 'react';


function App() {
  const url = "http://localhost:40699/api/gestores"
  const [data, setData] = useState([])
  const [modalInsert, setModalInsert] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
        id: "",
        nombre: "",
        lanzamiento: "",
        desarrollador: ""
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    })

  }
  const abrirCerrarModal = () => {
    setModalInsert(!modalInsert)
  }
  const abrirCerrarModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete)
  }

  const peticionGet = async () => {
    await axios.get(url)
      .then(res => {
        setData(res.data)
      }).catch(err => {
        console.log(err);
      })
  }

  const peticionPost = async () => {
    delete gestorSeleccionado.id;
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento)
    await axios.post(url, gestorSeleccionado)
      .then(res => {
        setData(data.concat(res.data))
        abrirCerrarModal();
      }).catch(err => {
        console.log(err);
      })
  }
  
  const peticionPut = async () => {
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento)
    await axios.put(url + "/" + gestorSeleccionado.id, gestorSeleccionado)
      .then(res => {
        data.map(elem => {
          if (elem.id === gestorSeleccionado.id) {
            elem.nombre = res.data.nombre;
            elem.lanzamiento = res.data.lanzamiento;
            elem.desarrollador = res.data.desarrollador;
          }
        })
        abrirCerrarModalEdit();
      }).catch(err => {
        console.log(err);
      })
  }

  const peticionDelete = async () => {
   
    await axios.delete(url + "/" + gestorSeleccionado.id)
      .then(res => {
       setData(data.filter(elem=>elem.id !=res.data));
       abrirCerrarModalDelete();
      }).catch(err => {
        console.log(err);
      })
  }


  const seleccionarGestor = (gestor, caso) => {
    setGestorSeleccionado(gestor);
    (caso ==="Editar") 
    ? abrirCerrarModalEdit()
    : abrirCerrarModalDelete()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="App">
      <br /><br />
      <button className="btn btn-success mb-2" onClick={() => abrirCerrarModal()}>Insertar nuevo Elemento</button>
      <table className="table table-bordered">
        <thead >
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>LANZAMIENTO</th>
            <th>DESARROLLADOR</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor => (
            <tr key={gestor.id}>
              <td>{gestor.id}</td>
              <td>{gestor.nombre}</td>
              <td>{gestor.lanzamiento}</td>
              <td>{gestor.desarrollador}</td>
              <td>
                <button
                  className="btn btn-primary" 
                  onClick={()=>seleccionarGestor(gestor,"Editar")}
                  >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={()=>seleccionarGestor(gestor,"Eliminar")}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsert}>
        <ModalHeader>Insertar Elemento</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label >Nombre:</label>
            <br />
            <input onChange={handleChange} name="nombre" type="text" className="form-control" />
            <br />
            <label >Lanzamiento:</label>
            <br />
            <input onChange={handleChange} name="lanzamiento" type="text" className="form-control" />
            <br />
            <label >Desarrollador:</label>
            <br />
            <input onChange={handleChange} name="desarrollador" type="text" className="form-control" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionPost()} className="btn btn-primary">Insertar</button>
          <button onClick={() => abrirCerrarModal()} className="btn btn-danger">Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Editar Elemento</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label >Id:</label>
            <br />
            <input  onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.id} type="text" className="form-control" readOnly />
            <label >Nombre:</label>
            <br />
            <input name="nombre" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre} type="text" className="form-control" />
            <br />
            <label >Lanzamiento:</label>
            <br />
            <input name="lanzamiento" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.lanzamiento} type="text" className="form-control" />
            <br />
            <label >Desarrollador:</label>
            <br />
            <input name="desarrollador" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.desarrollador} type="text" className="form-control" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionPut()} className="btn btn-primary">Registrar</button>
          <button onClick={() => abrirCerrarModalEdit()} className="btn btn-danger">Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalHeader>Eliminar Elemento</ModalHeader>
        <ModalBody>
         ¿Deseas eliminar {gestorSeleccionado && gestorSeleccionado.nombre}
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionDelete()} className="btn btn-danger">Si</button>
          <button onClick={() => abrirCerrarModalDelete()} className="btn btn-secundary">No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
