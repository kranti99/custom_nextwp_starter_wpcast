import Image from 'next/image'

export default function Post( data ){

    const post = data.post;

    return (
        <div>
            <h1>{post.title}</h1>
            <Image width="640" height="426" src={post.featuredImage.node.sourceUrl} />
            <article dangerouslySetInnerHTML={{__html: post.content}}></article>
            <div>{post.video}</div>
        </div>
    )

}

export async function getServerSideProps(context) {

    const res = await fetch('https://kantiman.com.np/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                        title
                        slug
                        content
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                        postsOptions {
                            video
                          }
                    }
                }
            `,
            variables: {
                id: context.params.slug,
                idType: 'SLUG'
            }
        })
    })

    const json = await res.json()

    return {
        props: {
            post: json.data.post,
        },
    }

}

export async function getServerSidePaths() {

    const res = await fetch('https://kantiman.com.np/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query AllPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                        postsOptions {
                            video
                        }
                    }
                }
            }
        `})
    })

    const json = await res.json()
    const posts = json.data.posts.nodes;

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }))

    return { paths, fallback: false }

}