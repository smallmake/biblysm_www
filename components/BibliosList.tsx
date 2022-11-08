import { useEffect, useState, memo } from 'react'
import { Row, Col, Image, Table, Button, Form, Badge, Modal } from 'react-bootstrap'
import { format } from "date-fns"
import { ja } from "date-fns/locale"


function BibliosList(props) {

  const ReadlogInfo = (props) => {
    if (!props.biblio.readlog_last_at) {
      return <></>
    } else {
      const lastDate = format(Date.parse(props.biblio.readlog_last_at), "MM/dd", {locale: ja,})
      const lastHour = format(Date.parse(props.biblio.readlog_last_at), "HH:mm", {locale: ja,})
      return (
        <Row className="text-center">
          <Col md={12}>{ lastDate }</Col>
          <Col md={12}>{ lastHour } </Col>
          { props.biblio.readlog_lapse ? <Col md={12}  className="my-0 small">[{ props.biblio.readlog_lapse }] </Col> : <></> }
        </Row>
      )
    }
  }

  return(
    !props.biblios ? <></> :
    props.biblios.map( (biblio) => 
      <tr key={biblio.uuid} className={props.readingBiblioIds.includes(biblio.id) ? "table-warning" : ""}>
        <td align='center'>
          <div style={{width: '60px'}}>
            <Image src={biblio.cover_image ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${biblio.cover_image}` : '/images/no_image.png'}  height={80} style={{maxWidth: '100%'}} />
          </div>
        </td>
        <td onClick={ (e) => props.onPushBiblio(e)} role="button" data-biblio-id={biblio.id}>
          <ul className="list-unstyled">
            <li>{ biblio.title }</li>
            <li className="text-muted">{ biblio.format ? biblio.format : "紙" }/{ biblio.category }</li>
            <li className="text-muted small">{ biblio.memo }</li>
          </ul>
        </td>
        <td className="align-middle">
          <div className="mx-2"><ReadlogInfo biblio={biblio} /></div>
        </td>
        <td className="text-end" style={{whiteSpace: "nowrap"}}>
            <div className="my-1">{ biblio.purchased_at }</div>
            <div className="my-1"><Button variant="outline-dark" className="btn-sm" onClick={(e) => props.onEditBiblio(e)} data-biblio-id={biblio.id}>編集</Button></div>
        </td>
      </tr>
    )
  )
}
export default memo(BibliosList)