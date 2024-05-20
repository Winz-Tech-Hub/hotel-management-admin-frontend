/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import Main from '../layout/Main'
import { Button, Card, Col, Container, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Spinner from '../components/general/Spinner'
import { CREATE_MIGRATION, MIGRATION, MIGRATION_NAMES } from '../scripts/config/RestEndpoints'
import fetcher from '../scripts/SharedFetcher'
import ModalBox from '../components/general/Modal'

function Migration(_props) {
  const location = useLocation()
  const [output, setOutput] = useState('')

  const [docs, setDocs] = useState(null)

  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')

  const [deletingSingleModel, setDeletingSingleModel] = useState(false)
  const [deletingAllModel, setDeletingAllModel] = useState(false)
  const [showConfirmSingleDeletion, setShowConfirmSingleDeletion] = useState(false)
  const [showConfirmAllDeletion, setShowConfirmAllDeletion] = useState(false)
  const [downloadingSingleModel, setDownloadingSingleModel] = useState(false)
  const [downloadingAllModel, setDownloadingAllModel] = useState(false)
  const [importingModel, setImportingModel] = useState(false)

  useEffect(() => {
    fetcher
      .fetch(MIGRATION_NAMES)
      .then((data) => {
        setModels(data?.data?.names)
      })
      .catch((error) => {
        setOutput(error.message)
      })
  }, [])

  function deleteSingleModel(e) {
    e?.preventDefault()
    setDeletingSingleModel(true)
    fetcher
      .fetch({ url: MIGRATION, method: 'DELETE', data: { models: [selectedModel] } })
      .then((data) => {
        setOutput(data?.data.message)
        setDeletingSingleModel(false)
      })
      .catch((error) => {
        setOutput(error.message)
        setDeletingSingleModel(false)
      })
  }

  function deleteAllModel(e) {
    e?.preventDefault()
    setDeletingAllModel(true)
    fetcher
      .fetch({ url: MIGRATION, method: 'DELETE', data: { all: true } })
      .then((data) => {
        setOutput(data?.data.message)
        setDeletingAllModel(false)
      })
      .catch((error) => {
        setOutput(error.message)
        setDeletingAllModel(false)
      })
  }

  function downloadSingleModel(e) {
    e?.preventDefault()
    setDownloadingSingleModel(true)
    fetcher
      .fetch(MIGRATION + selectedModel)
      .then((data) => {
        const doc = data?.data?.model
        if (doc) {
          const modelName = Object.keys(doc)[0] || ''
          const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = url
          link.download = `${modelName}.json`
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
        setOutput(data?.data?.message)
        setDownloadingSingleModel(false)
      })
      .catch((error) => {
        setOutput(error.message)
        setDownloadingSingleModel(false)
      })
  }

  function downloadAllModel(e) {
    e?.preventDefault()
    const fn = async () => {
      setDownloadingAllModel(true)
      let i = 1
      for (const model of models) {
        try {
          const data = await fetcher.fetch(MIGRATION + model)
          const doc = data?.data?.model
          if (doc) {
            const modelName = Object.keys(doc)[0] || ''
            const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `${modelName}.json`
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            setOutput((previous) => previous + '\n' + `${i++}. ${model} Downloaded`)
          }
        } catch (error) {
          setOutput(output + '\n' + error?.message)
        }
      }
      setDownloadingAllModel(false)
    }
    fn()
  }

  function importModel(e) {
    e?.preventDefault()
    setImportingModel(true)

    const formData = new FormData()

    for (let index = 0; index < docs.length; index++) {
      const doc = docs.item(index)
      formData.append('docs', doc)
    }

    const fOption = {
      url: CREATE_MIGRATION,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }
    fetcher
      .fetch(fOption)
      .then((data) => {
        setOutput(data?.data.message)
        setImportingModel(false)
      })
      .catch((error) => {
        setOutput(error.message)
        setImportingModel(false)
      })
  }

  return (
    <>
      <Main>
        <Container fluid>
          <Row>
            <ModalBox
              show={showConfirmSingleDeletion}
              onCancel={() => setShowConfirmSingleDeletion(false)}
              onAccept={() => {
                setShowConfirmSingleDeletion(false)
                deleteSingleModel()
              }}
              header={<h1 className="text-center">Confirm Deletion</h1>}
              type="danger"
              backdrop
            >
              <span>Are Sure you want to delete this model</span>
            </ModalBox>

            <ModalBox
              show={showConfirmAllDeletion}
              onCancel={() => setShowConfirmAllDeletion(false)}
              onAccept={() => {
                setShowConfirmAllDeletion(false)
                deleteAllModel()
              }}
              header={<h1 className="text-center">Confirm Deletion</h1>}
              type="danger"
              backdrop
            >
              <span>Are Sure you want to delete all model in your database</span>
            </ModalBox>

            <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
              <Col xs="12" className="mt-3">
                <Card>
                  <Card.Header className="mt-0 pt-0">
                    <Row>
                      <Col xs="12" className="p-1">
                        <InputGroup>
                          <InputGroup.Text className="fw-bold">Models</InputGroup.Text>
                          <FormSelect value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
                            <option key={'first'} value={''}>
                              Select model
                            </option>
                            {models.map((model) => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                          </FormSelect>

                          <Spinner loading={downloadingSingleModel} loadingText={`Downloading ${selectedModel}`}>
                            <Button onClick={downloadSingleModel} className="fw-bold utilityLink">
                              Download
                            </Button>
                          </Spinner>

                          <Spinner loading={deletingSingleModel} loadingText={`Deleting ${selectedModel}`}>
                            <Button
                              onClick={() => setShowConfirmSingleDeletion(true)}
                              className="fw-bold utilityLink"
                              variant="danger"
                            >
                              Delete
                            </Button>
                          </Spinner>
                        </InputGroup>
                      </Col>

                      <Col xs="12" className="p-1">
                        <InputGroup>
                          <InputGroup.Text className="fw-bold">Bulk</InputGroup.Text>
                          <Spinner loading={downloadingAllModel} loadingText="Downloading all models">
                            <Button onClick={downloadAllModel} className="fw-bold utilityLink">
                              Download all models
                            </Button>
                          </Spinner>

                          <Spinner loading={deletingAllModel} loadingText="">
                            <Button
                              onClick={() => setShowConfirmAllDeletion(true)}
                              className="fw-bold utilityLink"
                              variant="danger"
                            >
                              Delete all models
                            </Button>
                          </Spinner>
                        </InputGroup>
                      </Col>

                      <Col xs="12" className="p-1">
                        <Form onSubmit={importModel}>
                          <InputGroup>
                            <InputGroup.Text className="fw-bold">Import model(s)</InputGroup.Text>
                            <Form.Control
                              type="file"
                              onChange={(e) => {
                                setDocs(e.target.files)
                              }}
                              required
                              multiple
                              disabled={importingModel}
                            />

                            <Spinner loading={importingModel} loadingText="Importing">
                              <Form.Control type="submit" value="Import" className="fw-bold utilityLink" />
                            </Spinner>
                          </InputGroup>
                        </Form>
                      </Col>
                    </Row>
                  </Card.Header>
                </Card>
              </Col>

              <Col xs="12" className="mt-3">
                <Card>
                  <Card.Footer style={{ background: 'gainsboro' }}>
                    <div>
                      <h2 className="text-center mb-3">Output</h2>
                      <pre>
                        <code>{output}</code>
                      </pre>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Migration
