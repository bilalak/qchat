import {
  AudioConfig,
  ResultReason,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { useRef, useState } from "react"

import { useGlobalMessageContext } from "@/features/globals/global-message-context"

import { GetSpeechToken } from "./speech-service"

export interface TextToSpeechProps {
  stopPlaying: () => void
  textToSpeech: (textToSpeak: string) => void
  isPlaying: boolean
}

export const useTextToSpeech = (): TextToSpeechProps => {
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<SpeakerAudioDestination>()

  const { showError } = useGlobalMessageContext()

  const stopPlaying = (): void => {
    setIsPlaying(false)
    if (playerRef.current) {
      playerRef.current.pause()
    }
  }

  const textToSpeech = async (textToSpeak: string): Promise<void> => {
    if (isPlaying) {
      stopPlaying()
    }

    const tokenObj = await GetSpeechToken()

    if (tokenObj.error) {
      showError(tokenObj.errorMessage)
      return
    }

    const speechConfig = SpeechConfig.fromAuthorizationToken(tokenObj.token, tokenObj.region)
    playerRef.current = new SpeakerAudioDestination()

    const audioConfig = AudioConfig.fromSpeakerOutput(playerRef.current)
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig)

    playerRef.current.onAudioEnd = () => {
      setIsPlaying(false)
    }

    synthesizer.speakTextAsync(
      textToSpeak,
      result => {
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
          setIsPlaying(true)
        } else {
          showError(result.errorDetails)
          setIsPlaying(false)
        }
        synthesizer.close()
      },
      function (_err) {
        synthesizer.close()
      }
    )
  }

  return { stopPlaying, textToSpeech, isPlaying }
}
