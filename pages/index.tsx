import type { NextPage } from 'next'
import { useCallback, useState } from 'react'

type Options = {
  method: string
  url: string
  data: {
    app_id: string
    sentence: string
    output_type: string
  }
}

const Home: NextPage = () => {
  const apiKey = String(process.env.NEXT_PUBLIC_APIKEY)
  const axios = require(`axios`)
  const BASE_URL = `https://labs.goo.ne.jp/api/hiragana`

  const [text1, setText1] = useState<string>('毎週花の金曜日')
  const [text2, setText2] = useState<string>('今ミライナビルにいる')
  const [answer, setAnswer] = useState<string>('')

  // 非同期のaxios
  const fetchApi = async (options: Options) => {
    try {
      const res = await axios(options)
      return await res
    } catch (error) {
      throw error
    }
  }

  // 引数の文字をカタカナにして返す
  const changeTextType = useCallback(async (sentence: string) => {
    const options: Options = {
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
  }, [])

  // formを送信 答えを押す
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const changeText1: string = await changeTextType(text1)
      const changeText2: string = await changeTextType(text2)

      // カタカナにした文字を配列に変換
      const arr1 = changeText1.split('')
      const arr2 = changeText2.split('')
      // console.log({ arr1 }, { arr2 })
      let answer1 = ''

      // 共通の文字を順に取得
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

  const setProbrem1 = useCallback(() => {
    setText1('コールド')
    setText2('デコード')
  }, [])
  const setProbrem2 = useCallback(() => {
    setText1('毎週花の金曜日')
    setText2('今ミライナビルにいる')
  }, [])
  const setProbrem3 = useCallback(() => {
    setText1('汝、文学と科学の力を信じよ')
    setText2('情報分析して改善アクション')
  }, [])

  return (
    <div className="min-h-screen px-4 py-10">
      <section className="flex flex-col gap-6">
        <div
          className="flex gap-2 cursor-pointer bg-gray-200 py-2 px-3 rounded-md duration-150 hover:shadow-md"
          onClick={setProbrem1}
        >
          <p>①</p>
          <div>
            <p>コールド</p>
            <p>デコード</p>
          </div>
        </div>
        <div
          className="flex gap-2 cursor-pointer bg-gray-200 py-2 px-3 rounded-md duration-150 hover:shadow-md"
          onClick={setProbrem2}
        >
          <p>②</p>
          <div>
            <p>毎週花の金曜日</p>
            <p>今ミライナビルにいる</p>
          </div>
        </div>
        <div
          className="flex gap-2 cursor-pointer bg-gray-200 py-2 px-3 rounded-md duration-150 hover:shadow-md"
          onClick={setProbrem3}
        >
          <p>③</p>
          <div>
            <p>汝、文学と科学の力を信じよ</p>
            <p>情報分析して改善アクション</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
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
          <div className="flex items-center mt-3 gap-3 justify-center">
            <button
              type="submit"
              className="inline w-10 text-white rounded border border-blue-500 bg-blue-500 duration-200 hover:text-blue-500 hover:bg-white"
            >
              答え
            </button>

            <div className="my-2 text-xl border-b-2 border-blue-500 text-red-600 text-center">
              {answer}
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Home
