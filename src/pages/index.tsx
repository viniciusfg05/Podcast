import {api} from '../services/api'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'


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
      published: format(parseISO(episode.published), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.duration),
      description: episode.description,
      url: episode.url,


    }
  })

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 60
  }
}