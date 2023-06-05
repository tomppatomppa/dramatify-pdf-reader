import { Field, Form, Formik } from 'formik'

import { Drag, Drop } from 'src/components/drag-and-drop'
import FormikTextArea from '../SceneComponent/FormikTextArea'

const EditorForm = ({ scene, AddLine, sceneIndex, DeleteLine }: any) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={scene}
      onSubmit={(values) => console.log(values)}
    >
      {({ values }) => (
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <button onClick={() => AddLine(sceneIndex)}>add</button>
          <Form>
            {values.data.map((line: any, lineIndex: number) => (
              <Drag
                className="draggable"
                key={line.id}
                id={line.id}
                index={lineIndex}
              >
                <button
                  type="button"
                  onClick={() => DeleteLine(sceneIndex, lineIndex)}
                >
                  delete
                </button>
                <div className="w-full my-2 flex flex-col" key={lineIndex}>
                  <Field
                    className="border border-black"
                    placeholder="select type"
                    as="select"
                    name={`data[${lineIndex}].type`}
                  >
                    <option value="INFO">Info</option>
                    <option value="ACTOR">Actor</option>
                  </Field>
                  <Field
                    className="text-center"
                    name={`data[${lineIndex}].name`}
                  />
                  <FormikTextArea
                    type={line.type}
                    lineName={line.name}
                    name={`data[${lineIndex}].lines`}
                  />
                </div>
              </Drag>
            ))}
          </Form>
        </Drop>
      )}
    </Formik>
  )
}

export default EditorForm
