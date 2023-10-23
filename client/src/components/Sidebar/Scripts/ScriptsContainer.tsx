import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
  useSetScripts,
} from 'src/store/scriptStore'
import { ScriptList } from './ScriptList'
import EmptyScriptList from '../../EmptyScriptList'
import { useQuery } from 'react-query'
import { fetchAllUserScripts } from 'src/API/scriptApi'
import { Script } from 'src/components/ReaderV3/reader.types'
import { isCurrentUserScripts } from 'src/utils/helpers'
import Spinner from 'src/components/common/Spinner'

interface ScriptContainerProps {
  children?: React.ReactNode
}

const ScriptsContainer = ({ children }: ScriptContainerProps) => {
  const scripts = useScripts()
  const setScripts = useSetScripts()
  const setActiveScript = useSetActiveScriptId()
  const deleteScript = useDeleteScript()

  //TODO: remove this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updateDatabaseWithLocalChanges, unsavedChanges } = useScriptStore()
  const scriptProps = {
    scripts: scripts,
    setActiveScript: setActiveScript,
    deleteScript: deleteScript,
  }

  const { isFetching } = useQuery(['scripts'], () => fetchAllUserScripts(), {
    onSuccess: async (data: Script[]) => {
      setScripts(data)
    },

    refetchOnWindowFocus: false,
  })

  return (
    <div
      className={`flex flex-col h-full gap-4 ${'opacity-100 transition-opacity duration-300 max-h-96'}`}
    >
      {children}
      <Spinner show={isFetching} />
      {scripts.length ? <ScriptList {...scriptProps} /> : <EmptyScriptList />}
    </div>
  )
}

export default ScriptsContainer
