import { useEffect, useState } from 'react'
import { useBiblio } from '../lib/useBiblio'
import Loading from './Loading'
import { Row, Col, Image, Button, Form, Modal } from 'react-bootstrap'
import { useForm } from "react-hook-form";
//import {format} from 'date-fns'

interface BiblioForm {
  uuid: string
  format: string
  asin: string
  isbn: string
  category: string
  priority: number
  genre: string
  place: string
  language: string
  title: string
  subtitle: string
  author: string
  publisher: string
  description: string
  pages: number
  aspect: string
  published_at: Date
  price: string
  currentvalue: string
  label: string
  used: number
  purchased_at: Date
  read_count: number
  memo: string
  note: string
  cover: File
}



// props: biblioID, categories, setEditBiblioID(nullにするとModalがとじられる)
export default function Biblio(props) {
  const { biblio, isFinished, updateBiblio, deleteBiblio, postCover } = useBiblio(props.biblioID)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BiblioForm>();
  const [coverImage, setCoverImage] = useState(null)

  const FormatSelector = () => {
    if (props.formats) {
      let formatOptions = [...props.formats]
      formatOptions.unshift("")
      return (
        <Form.Select {...register("format")} defaultValue={biblio.format}  className="col-auto">
          { formatOptions.map((format, index) => (<option value={ format } key={ index }>{ format }</option>))}
        </Form.Select>
      )
    }
  }

  const CategorySelector = () => {
    if (props.categories) {
      let categoryOptions = [...props.categories]
      categoryOptions.unshift("")
      return (
        <Form.Select {...register("category")} defaultValue={biblio.category}  className="col-auto">
          { categoryOptions.map((category, index) => (<option value={ category } key={ index }>{ category }</option>))}
        </Form.Select>
      )
    }
  }

  const onSubmit = async (data) => {
    await updateBiblio(data)
    props.reloadPage()
    props.setEditBiblioID(null)
  }

  const closeForm = () => {
    props.reloadPage()
    props.setEditBiblioID(null)
  }

  const setCoverImageFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setCoverImage(img)
    }
  }

  const uploadCoverIname = async (e) => {
    e.preventDefault() // preventDefault これは外側のFormをsubmitしないようにするために必要
    if (coverImage) {
      const body = new FormData();
      body.append("cover", coverImage )
      await postCover(body)
      setCoverImage(null)
    }
  }

  const onDeleteBiblio = async() => {
    if( confirm("削除します。")) {
      deleteBiblio()
      props.reloadPage()
      props.setEditBiblioID(null)
    }
  }

  return (
    !biblio || !isFinished ? <Loading /> :
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="row g-1" >
        <Row className="mb-1">
          <Col md={3}>
            <Row className="mb-1">
              <Image src={biblio.cover_image ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${biblio.cover_image}` : '/images/no_image.png'}  height={250} />
            </Row>
            <Row className="mb-2 small">
              <Form.Control type="file" name="coverImage" onChange={(e) => setCoverImageFile(e)} />
              <Button type="submit" variant="outline-dark" size="sm" onClick={(e) => uploadCoverIname(e)} >アップ</Button>
            </Row>
          </Col>
          <Col md={9}>
            <Row className="mb-1">
              <Col>
                <div className="float-start">
                  <Button variant="outline-dark" onClick={() => onDeleteBiblio()} >削除</Button>
                </div>
                <div className="float-end">
                  <Button type="submit" variant="warning" className="me-3">保存</Button>
                  <Button variant="outline-dark" onClick={() => closeForm()} >キャンセル</Button>
                </div>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Label htmlFor="format" className="visually-hidden">フォーマット</Form.Label>
                <FormatSelector />
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="priority" className="visually-hidden">優先順位</Form.Label>
                <Form.Control type="text" placeholder="優先順位" {...register("priority")} defaultValue={biblio.priority} />
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Label htmlFor="category" className="visually-hidden">カテゴリ</Form.Label>
                <CategorySelector />
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="purchased_at" className="visually-hidden">購入日</Form.Label>
                <Form.Control type="date" placeholder="購入日" {...register("purchased_at")} defaultValue={biblio.purchased_at}/>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Label htmlFor="publisher" className="visually-hidden">出版社</Form.Label>
                <Form.Control type="text" placeholder="出版社" {...register("publisher")} defaultValue={biblio.publisher}/>
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="published_at" className="visually-hidden">発行日</Form.Label>
                <Form.Control type="date" placeholder="発行日" {...register("published_at")} defaultValue={biblio.published_at}/>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Label htmlFor="asin" className="visually-hidden">ASIN</Form.Label>
                <Form.Control type="text" placeholder="ASIN"{...register("asin")} defaultValue={biblio.asin}/>
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="isbn" className="visually-hidden">ISBN</Form.Label>
                <Form.Control type="text" placeholder="ISBN"{...register("isbn")} defaultValue={biblio.isbn}/>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Label htmlFor="used" className="visually-hidden">中古</Form.Label>
                <Form.Control type="number" placeholder="中古" {...register("used")} defaultValue={biblio.used}/>
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="read_count" className="visually-hidden">読んだ回数</Form.Label>
                <Form.Control type="number" placeholder="読んだ回数" {...register("read_count")} defaultValue={biblio.read_count}/>
              </Col>
            </Row>
            <Row>
              <div className="small text-muted">ID:{ biblio.uuid }</div>
            </Row>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={12}>
            <Form.Label htmlFor="title" className="visually-hidden">タイトル</Form.Label>
            <Form.Control type="text" placeholder="タイトル" {...register("title")} defaultValue={biblio.title}/>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={12}>
            <Form.Label htmlFor="subtitle" className="visually-hidden">サブタイトル</Form.Label>
            <Form.Control type="text" placeholder="サブタイトル" {...register("subtitle")} defaultValue={biblio.subtitle}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={8}>
            <Form.Label htmlFor="author" className="visually-hidden">著者</Form.Label>
            <Form.Control type="text" placeholder="著者" {...register("author")} defaultValue={biblio.author}/>
          </Col>
          <Col md={4}>
            <Form.Label htmlFor="label" className="visually-hidden">レーベル名</Form.Label>
            <Form.Control type="text" placeholder="レーベル名" {...register("label")} defaultValue={biblio.label}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={5}>
            <Form.Label htmlFor="genre" className="visually-hidden">ジャンル</Form.Label>
            <Form.Control type="text" placeholder="ジャンル" {...register("genre")} defaultValue={biblio.genre}/>
          </Col>
          <Col md={5}>
            <Form.Label htmlFor="place" className="visually-hidden">場所</Form.Label>
            <Form.Control type="text" placeholder="場所" {...register("place")} defaultValue={biblio.place}/>
          </Col>
          <Col md={2}>
            <Form.Label htmlFor="language" className="visually-hidden">言語</Form.Label>
            <Form.Control type="text" placeholder="言語" {...register("language")} defaultValue={biblio.language}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={12}>
            <Form.Label htmlFor="discription" className="visually-hidden">概要</Form.Label>
            <Form.Control as="textarea" placeholder="概要" style={{ height: '100px' }} {...register("discription")} defaultValue={biblio.discription}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={2}>
            <Form.Label htmlFor="pages" className="visually-hidden">ページ数</Form.Label>
            <Form.Control type="number" placeholder="ページ数" {...register("pages")} defaultValue={biblio.pages}/>
          </Col>
          <Col md={4}>
            <Form.Label htmlFor="aspect" className="visually-hidden">アスペクト</Form.Label>
            <Form.Control type="text" placeholder="アスペクト" {...register("aspect")} defaultValue={biblio.aspect}/>
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="price" className="visually-hidden">価格</Form.Label>
            <Form.Control type="text" placeholder="価格" {...register("price")} defaultValue={biblio.price}/>
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="currentvalue" className="visually-hidden">現価格</Form.Label>
            <Form.Control type="text" placeholder="現価格" {...register("currentvalue")} defaultValue={biblio.currentvalue}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={12}>
            <Form.Label htmlFor="memo" className="visually-hidden">備考</Form.Label>
            <Form.Control type="text" placeholder="備考" {...register("memo")} defaultValue={biblio.memo}/>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={12}>
            <Form.Label htmlFor="note" className="visually-hidden">ノート</Form.Label>
            <Form.Control tas="textarea" placeholder="ノート" style={{ height: '100px' }} {...register("note")} defaultValue={biblio.note}/>
          </Col>
        </Row>
      </Form>
    </>
  )
}
