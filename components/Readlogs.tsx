import { useEffect, useState, useRef } from 'react'
import { useReadlogs } from '../lib/useReadlogs'
import { useBibliotecaFormats } from '../lib/useBibliotecaFormats'
import Loading from './Loading'
import { Row, Col, Table, Button, Form, Badge, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import Readlog from './Readlog'
import PaginationBar from './PaginationBar'
import { useForm } from "react-hook-form";
import ReadlogsList from "./ReadlogsList"

export default function Readlogs(props) {
  const { readlogs, pagination, isFinished, setPage, reloadPage, deleteReadlog } = useReadlogs(props.bibliotecaID, props.biblioID)
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [paginationTabs, setPaginationTabs] = useState([])
  const [editReadlogID, setEditReadlogID] = useState(null)
  
  useEffect(() => {
    if (pagination && isFinished) {
      const _paginationTabs = PaginationBar({pagination,  onPaginationClick: setPage})
      setPaginationTabs(_paginationTabs)
    }
  }, [pagination, isFinished])

  const delReadlog = (e) => {
    const readlogID = e.currentTarget.dataset.readlogId
    if(confirm("削除します。")) {
      deleteReadlog(readlogID)
    }
  }

  const editReadlog = (e) => {
    const readlogID = e.currentTarget.dataset.readlogId
    setEditReadlogID(readlogID)
  }

  const EditReadlogModal = () => (
    !editReadlogID ? <></> :
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered 
      show={editReadlogID != null}
      onHide={() => setEditReadlogID(null)}
    >
      <Modal.Header closeButton>
        <Modal.Title><h5>ログ編集</h5></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Readlog readlogID={editReadlogID} setEditReadlogID={setEditReadlogID} reloadPage={reloadPage} />
      </Modal.Body>
    </Modal>
  )

  return (
    !readlogs || !isFinished ? <Loading /> :
    <>
      <Row className="border-top">
        <ReadlogsList readlogs={readlogs} editReadlog={editReadlog} delReadlog={delReadlog} />
      </Row>
      <EditReadlogModal />
    </>
  )
}
