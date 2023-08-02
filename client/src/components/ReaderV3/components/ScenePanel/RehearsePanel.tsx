import { useState } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Actor, Line, Scene } from '../../reader.types'

import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { AiOutlineSync } from 'react-icons/ai'
import { filterAudioFiles, filterLines } from '../../utils'
import { FaStop } from 'react-icons/fa'
import Modal from 'src/components/common/Modal'
import { RootFolder, useRootFolder } from 'src/store/scriptStore'
import Spinner from 'src/components/common/Spinner'
import Message from 'src/components/common/Message'
import { useMutation } from 'react-query'
import { createTextToSpeechFromScene } from 'src/API/googleApi'
import AudioPlayer from './AudioPlayer'
import { useCurrentUser } from 'src/store/userStore'
import Checkbox from 'src/components/common/Checkbox'
import Tooltip from 'src/components/common/Tooltip'
import Dropdown from 'src/components/common/Dropdown'
import Profile from 'src/components/profile/Profile'
import Wrapper from 'src/layout/Wrapper'
import SelectList from 'src/components/SelectList'

function commandBuilder(
  lines: Line[],
  action: (lineIndex: number, command: string) => void
) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: (command: any, spokenPhrase: any, similarityRatio: number) =>
      action(index, command),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.5,
    bestMatchOnly: true,
  }))
}

const RehearsePanel = () => {
  const user = useCurrentUser()
  const rootFolder = useRootFolder() as RootFolder
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [startRehearse, setStartRehearse] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options, scriptId } = useReaderContext()
  const { audioFiles, isValid, setIsSyncing, isSyncing } = useAudio(
    values,
    scriptId,
    rootFolder?.id
  )

  const filteredLines = filterLines(values, options)

  const uniqueActors = [
    ...new Set(values.data.map((line) => line.name || line.type)),
  ]

  const commands = commandBuilder(filteredLines, (lineIndex, command) => {
    const nextLine = filteredLines[lineIndex + 1]
    if (nextLine) {
      console.log(`SPOKEN LINE ${command} -> NEXT LINE ${nextLine.lines}}`)
    }
  })

  const { transcript, listening, resetTranscript } = useSpeechRecognition({
    commands,
  })

  const filteredAudio = filterAudioFiles(values, audioFiles, options)

  const { mutate, isError, isLoading } = useMutation(
    createTextToSpeechFromScene,
    {
      onSuccess: (data) => {
        setMessage(`Successfully added audio for ${data.name}`)
        //Toggle query for downloading files
        setIsSyncing(true)
      },
      onError: () => {
        setMessage('Something went wrong')
      },
    }
  )

  //Disable controls for visitors
  //Google auth required
  if (user?.name === 'visitor') {
    return <div className="text-red-900">Not available in visitor mode</div>
  }
  SpeechRecognition.startListening({
    language: 'sv-SE',
    continuous: true,
  })
  return (
    <div className="flex gap-4 mr-12 w-full flex-col sm:flex-row">
      <Modal
        title="Create audio files for the scene?"
        content="This process will only take a couple
         seconds"
        show={showModal}
        close={() => setShowModal(false)}
        onAccept={() =>
          mutate({
            scriptId,
            scene: values,
            rootFolderId: rootFolder.id,
          })
        }
      >
        <Spinner show={isLoading} />
        <Message type={isError ? 'alert' : 'success'} message={message} />
      </Modal>

      <button
        onClick={() => setIsSyncing(true)}
        className={`${isSyncing ? 'text-gray-400 animate-spin' : ''} `}
      >
        <AiOutlineSync size={24} />
      </button>
      <span className="w-full"></span>
      <Dropdown title="Filter">
        <Wrapper>
          <SelectList labels={uniqueActors} />
        </Wrapper>
      </Dropdown>
      {/* {startRehearse ? (
        <div className="flex flex-row gap-6 justify-start items-center">
          <AudioPlayer
            files={filteredAudio}
            listening={listening}
            transcript={transcript}
            setListen={() =>
              SpeechRecognition.startListening({
                language: 'sv-SE',
                continuous: true,
              })
            }
            stopListen={() => {
              SpeechRecognition.stopListening()
              resetTranscript()
            }}
          />
        </div>
      ) : null} */}
      {isValid ? (
        <button
          type="button"
          onClick={() => {
            setStartRehearse(!startRehearse)
            SpeechRecognition.stopListening()
          }}
        >
          {startRehearse ? <FaStop color="red" /> : 'Rehearse'}
        </button>
      ) : (
        <button
          type="button"
          disabled={isSyncing}
          className="text-red-900"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      )}
    </div>
  )
}

export default RehearsePanel
