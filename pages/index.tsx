import type { NextPage } from 'next'
import { useCallback, useState } from 'react'

const Home: NextPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_APIKEY
  // console.log({ apiKey })

  const [text1, setText1] = useState('毎週花の金曜日')
  const [text2, setText2] = useState('今ミライナビルにいる')
  const [changeText1, setChangeText1] = useState('')
  const [changeText2, setChangeText2] = useState('')
  const [answer, setAnswer] = useState('')

  const axios = require(`axios`)
  const APIKEY = `xxxxxxxxxxxxx` //API KEY
  const BASE_URL = `https://labs.goo.ne.jp/api/hiragana`
  const SENTECE = '汝、文学と科学の力を信じよ'

  const fetchApi = async (options) => {
    try {
      const res = await axios(options)
      return await res
    } catch (error) {
      throw error
    }
  }
  const changeTextType = async (sentence: string) => {
    const options = {
      method: 'post',
      url: BASE_URL,
      data: {
        app_id: apiKey,
        sentence: sentence,
        output_type: 'katakana',
      },
    }

    const fetchData = fetchApi(options) //axios(options)
      .then((res) => {
        console.log(res.data.converted)
        return res.data.converted
      })
      .catch((err) => {
        console.log(err)
      })
    return fetchData
  }

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      console.log(changeTextType(text1))
      console.log(changeTextType(text2))

      const changeText1: string = await changeTextType(text1)
      const changeText2: string = await changeTextType(text2)
      console.log({ changeText1 }, { changeText2 })

      const arr1 = changeText1.split('')
      const arr2 = changeText2.split('')
      console.log({ arr1 }, { arr2 })
      let answer1 = ''

      arr1.forEach((v) => {
        arr2.some((v2, i) => {
          if (v2 != ' ' && v2 === v) {
            answer1 += v2
            arr2.splice(0, i + 1)
            return true
          }
        })
      })

      setAnswer(answer1)
    },
    [text1, text2]
  )

  const setProbrem3 = () => {
    setText1('')
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <section className="flex flex-col gap-6">
        <div className="flex gap-2">
          <p>①</p>
          <div>
            <p>コールド</p>
            <p>デコード</p>
          </div>
        </div>
        <div className="flex gap-2">
          <p>①</p>
          <div>
            <p>毎週花の金曜日</p>
            <p>マイシュウハナノキンヨウビ</p>
          </div>
        </div>
        <div className="flex gap-2">
          <p>①</p>
          <div>
            <p>汝、文学と科学の力を信じよ</p>
            <p>情報分析して改善アクション</p>
          </div>
        </div>
      </section>
      <form onSubmit={(e) => onSubmit(e)} className="flex flex-col">
        <input
          type="text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="border border-black"
        />
        <input
          type="text"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="border border-black"
        />
        <button type="submit">答え</button>
      </form>
      <div className="my-2 text-xl border-b text-red-600">{answer}</div>
    </div>
  )
}

export default Home
