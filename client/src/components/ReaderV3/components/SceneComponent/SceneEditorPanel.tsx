import { useFormikContext } from 'formik'

const SceneEditorPanel = (props: any) => {
  const { dirty, resetForm } = useFormikContext()
  const { isEditing, setIsEditing, addLine } = props

  const buttonStyle = dirty ? 'text-black' : 'text-gray-400'

  return (
    <div className="flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button
            disabled={!dirty}
            type="button"
            className={buttonStyle}
            onClick={() => resetForm()}
          >
            Undo
          </button>
          <button type="button" onClick={addLine}>
            Add Line
          </button>
          <button disabled={!dirty} className={buttonStyle} type="submit">
            Save
          </button>
        </>
      ) : null}
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        Edit
      </button>
    </div>
  )
}

export default SceneEditorPanel
