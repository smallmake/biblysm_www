import { useEffect, useState, memo } from 'react'
import { Row, Col, Image, Table, Button, Form, Badge, Modal } from 'react-bootstrap'
import { format } from "date-fns"
import { ja } from "date-fns/locale"

function BibliosList(props) {
  return(
    !props.biblios ? <></> :
    props.biblios.map( (biblio) => 
      <tr key={biblio.uuid} className={props.readingBiblioIds.includes(biblio.id) ? "table-warning" : ""}>
        <td><Image src={biblio.cover_image ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${biblio.cover_image}` : '/images/no_image.png'}  width={60} /></td>
        <td onClick={ (e) => props.onPushBiblio(e)} data-biblio-id={biblio.id}>
          <ul className="list-unstyled">
            <li>{ biblio.title }</li>
            <li className="text-muted">{ biblio.format ? biblio.format : "紙" }/{ biblio.category }</li>
            <li className="text-muted small">{ biblio.memo }</li>
          </ul>
        </td>
        <td nowrap="nowrap" className="align-middle">
          <div className="mx-2">{ biblio.readlog_last_at ? format(Date.parse(biblio.readlog_last_at), "MM/dd HH:mm", {locale: ja,}) : <></> }</div>
        </td>
        <td nowrap='nowrap' className="text-end">
            <div className="my-1">{ biblio.purchased_at }</div>
            <div className="my-1"><Button variant="outline-dark" className="btn-sm" onClick={(e) => props.onEditBiblio(e)} data-biblio-id={biblio.id}>編集</Button></div>
        </td>
      </tr>
    )
  )
}
export default memo(BibliosList)