import {api} from '../services/api'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDuractionTimeString } from '../utils/convertDuractionTimeString'


type Epispode = {
  id: String;
  title: String;
  members: String
  //....
}

type HomeProps = {
  episodes: Epispode[];
}

//  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {


export default function Home(props: HomeProps) {
  
  return (
    <div>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}


export const  getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published-at',
      _order: 'desc'
    }
  })
  

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: convertDuractionTimeString(Number(episode.file.duration)),
      duration: Number(episode.duration),
      description: episode.description,
      url: episode.url,
    }
  })

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 60
  }
}