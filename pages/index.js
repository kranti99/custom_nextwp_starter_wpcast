import Link from 'next/link'

export default function Home( {posts} ){

  return(
    <div>
      <h1>Hello From The Home Page!</h1>
      {
        posts.nodes.map(post => {
          return(
            <ul key={post.slug}>
              <li>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            </ul>
          )
        })
      }
    </div>
  )

}

export async function getServerSideProps(){

    const res = await fetch('https://kantiman.com.np/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query HomePageQuery {
              posts {
                nodes {
                  slug
                  title
                }
              }
            }
            `,
        })
    })
  
    const json = await res.json()
  
    return {
      props: {
          posts: json.data.posts,
      },
    }
  
  }