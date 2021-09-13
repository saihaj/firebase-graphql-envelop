import React, { useEffect, useRef, useState } from 'react'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.min.css'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyDCEgMCstUJPjD9bHjdrkQecSQfVEH0B7k',
  authDomain: 'graphiql-auth-demo.firebaseapp.com',
  projectId: 'graphiql-auth-demo',
  storageBucket: 'graphiql-auth-demo.appspot.com',
  messagingSenderId: '484746233715',
  appId: '1:484746233715:web:3862be67dd3f5eecc1a706',
  measurementId: 'G-TGM8KSCNJG',
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

const ENDPOINT = '/api'

const inform = `# You must login to query the API
`

const App = () => {
  const graphiqlRef = useRef<GraphiQL>()
  const [token, setToken] = useState('')
  const [user, setUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => setUser(user))

    return () => {
      listener()
    }
  }, [auth])

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    result.user?.getIdToken().then((token) => setToken(token))
  }

  const logout = async () => {
    await auth.signOut()
    setToken('')
  }

  return (
    <GraphiQL
      // @ts-ignore
      ref={graphiqlRef}
      defaultQuery={inform}
      fetcher={async (graphQLParams) => {
        // @ts-ignore
        const data = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(graphQLParams),
        })
        return data.json().catch(() => data.text())
      }}
      // readOnly={!user}
    >
      <GraphiQL.Logo>
        {user ? (
          // @ts-ignore
          <img width="35" src={user?.photoURL} alt="logo" />
        ) : (
          <img
            width="35"
            alt="Envelop Logo"
            src="https://www.envelop.dev/logo.png"
          ></img>
        )}
      </GraphiQL.Logo>
      <GraphiQL.Toolbar>
        {user ? (
          <GraphiQL.ToolbarButton
            onClick={() => logout()}
            label="Logout"
            title="Sign-out"
          ></GraphiQL.ToolbarButton>
        ) : (
          <GraphiQL.ToolbarButton
            onClick={() => login()}
            label="Login"
            title="Sign-in to continue"
          ></GraphiQL.ToolbarButton>
        )}
        <GraphiQL.Button
          onClick={() => graphiqlRef?.current?.handlePrettifyQuery()}
          label="Prettify"
          title="Prettify Query (Shift-Ctrl-P)"
        />
        <GraphiQL.Button
          onClick={() => graphiqlRef?.current?.handleToggleHistory()}
          label="History"
          title="Show History"
        />
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            You are logged in as {user?.email}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Login to continue
          </div>
        )}
      </GraphiQL.Toolbar>
    </GraphiQL>
  )
}

export default App
