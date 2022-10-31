import { useEffect, useState, memo } from 'react'
import { Row, Col, Image, Table, Button, Form, Badge, Modal } from 'react-bootstrap'
import { format } from "date-fns"
import { ja } from "date-fns/locale"

function ReadlogsList(props) {
  return(
    !props.readlogs ? <Row><Col md="auto">なし</Col></Row> :
    props.readlogs.map( (readlog) => (
      <Row key={readlog.id} className="my-1 border-bottom">
        <Col md={7} sm={6} className="float-start">
          { readlog.biblio_title } { readlog.biblio_subtitle } 
          { readlog.memo ? <span className="small text-muted ms-3">{readlog.memo}</span> : <></>} 
        </Col>
        <Col md={5} sm={6}>
          <Row>
            <Col md={8} sm={7}>
              <Row>
                <Col md={6} style={{whiteSpace:"nowrap"}} >開始: { format(Date.parse(readlog.start_at), "yyyy/MM/dd HH:mm", {locale: ja,}) }</Col>
                <Col md={6} style={{whiteSpace:"nowrap"}} >終了: { readlog.end_at ? format(Date.parse(readlog.end_at), "yyyy/MM/dd HH:mm", {locale: ja,}): "読書中..." }</Col>
              </Row>
            </Col>
            <Col md={4} sm={5} className="text-end mb-1">
              <Button size="sm" className="me-2" variant="outline-dark" onClick={(e) => props.editReadlog(e) } data-readlog-id={readlog.id}>編集</Button>
              <Button size="sm" variant="outline-dark" onClick={(e) => props.delReadlog(e) } data-readlog-id={readlog.id}>削除</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    ))
  )
}
export default memo(ReadlogsList)