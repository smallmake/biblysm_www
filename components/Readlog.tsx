import { useEffect, useState } from 'react'
import { useReadlog } from '../lib/useReadlog'
import Loading from './Loading'
import { Row, Col, Image, Button, Form, Modal } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface ReadlogForm {
  biblioteca_id: number
  biblio_id: number
  start_at: Date
  end_at: Date
  memo: string
}

// props: biblioID, categories, setEditBiblioID(nullにするとModalがとじられる)
export default function Readlog(props) {
  const { readlog, isFinished, updateReadlog } = useReadlog(props.readlogID)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReadlogForm>();

  const onSubmit = async (data) => {
    await updateReadlog(data)
    await props.reloadPage()
    props.setEditReadlogID(null)
  }

  const closeForm = () => {
    props.setEditReadlogID(null)
  }

  const datetimeToSttr = (datetime) => {
    let datetimeStr = ""
    if (datetime) {
      datetimeStr = format(Date.parse(datetime), "yyyy-MM-dd HH:mm", {locale: ja,})
    }
    return datetimeStr
  }

  return (
    !readlog || !isFinished ? <Loading /> :
    <Form onSubmit={handleSubmit(onSubmit)} className="row g-1" >
      <Row className="mb-1">
        <Form.Label htmlFor="start_at" className="col-md-3">開始日時</Form.Label>
        <Col md={7}>
          <Form.Control type="datetime-local" placeholder="開始日時" {...register("start_at")} defaultValue={datetimeToSttr(readlog.start_at)} />
        </Col>
      </Row>
      <Row className="mb-1">
        <Form.Label htmlFor="end_at" className="col-md-3">終了日時</Form.Label>
        <Col md={7}>
          <Form.Control type="datetime-local" placeholder="終了日時" {...register("end_at")} defaultValue={datetimeToSttr(readlog.end_at)} />
        </Col>
      </Row>
      <Row className="mb-1">
        <Col md={12}>
          <Form.Control as="textarea" placeholder="メモ" {...register("memo")} style={{ height: '100px' }} defaultValue={readlog.memo} />
        </Col>
      </Row>
      <Row className="my-1">
          <div className="text-end">
            <Button variant="outline-dark" type="submit" className="mx-2">OK</Button>
            <Button variant="outline-dark" onClick={() => closeForm()} >中止</Button>
          </div>
      </Row>
    </Form>
  )
}
