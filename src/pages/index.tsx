import Head from 'next/head'
import { Layout } from '../modules/Layout'
import { StepBlog } from '../modules/StepBlog'
import { StepIntroduction } from '../modules/StepIntroduction'
import { StepSummary } from '../modules/StepSummary'
import { StepSkills } from '../modules/StepSkills'

const Home = () => (
  <>
    <Head>
      <title>Leninner | Learning everytime</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <StepIntroduction />
      <StepBlog />
      <StepSummary />
      <StepSkills />
    </Layout>
  </>
)

export default Home
