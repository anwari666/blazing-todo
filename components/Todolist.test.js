/* eslint-env jest */
import React from 'react'
import TodolistQuery, { FETCH_TODO } from './Todolist'
import { MockedProvider } from '@apollo/react-testing'

import { render, cleanup, act, wait, findAllByLabelText, getAllByPlaceholderText, getAllByText } from '@testing-library/react'
// import wait from 'waait'
import "@testing-library/jest-dom"

const mocks= [{
    request: {
        query: FETCH_TODO,
        variables: { todolist_url: "something" }
    },
    result: {
        "data": {
          "todolist": [
            {
              "id": "6efb65e3-9567-4d18-a205-aa2c102ccc14",
              "date_created": "2019-11-14T13:03:59.447845",
              "date_completed": "2019-11-14T00:00:01",
              "title": "first list",
              "url": "firstlist",
              "todos": [
                {
                  "completed": true,
                  "date_created": "2020-01-18T21:12:00.27135",
                  "id": "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4",
                  "label": "first list",
                  "order": 8,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                },
                {
                  "completed": true,
                  "date_created": "2020-01-18T23:46:36.28198",
                  "id": "9eeb351d-1eb7-4da8-af04-2a82593f1c04",
                  "label": "second list",
                  "order": 8,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                },
                {
                  "completed": false,
                  "date_created": "2020-01-28T00:04:07.583056",
                  "id": "609b9753-e59d-4c73-805d-5789d1ced5e5",
                  "label": "third list",
                  "order": 8,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                }
              ]
            }
          ]
        }
      }    
}]

describe("Todolist", () => {

    afterEach( cleanup )

    test.skip("Should render loading state", async ()=>{
        const id = "id"
        const url = "non-existent-url"
        const todos = []

        const {getByText, container} = render(
            <MockedProvider mocks={mocks} addTypename={ false }>
                <TodolistQuery url={ url } />
            </MockedProvider>
            )
        expect(container.firstChild).toMatchSnapshot()
        expect(getByText('Loading')).toBeDefined()

        await wait()
    });

    test.skip("Should render result", async ()=>{
        const id = "id"
        const url = "something"
        const todos = []

        
        const {getByLabelText, container} = render(
            <MockedProvider mocks={mocks} addTypename={ false }>
                <TodolistQuery url={ url } />
            </MockedProvider>
        )

        await wait();
        expect(container.firstChild).toMatchSnapshot()
        expect(getByLabelText('first list')).toBeDefined()
        expect(getByLabelText('second list')).toBeDefined()

    });

    test("Should render loading then result", async ()=>{
      const id = "id"
      const url = "something"
      const todos = []

      
      const {getByLabelText, getByText, getAllByText, findByLabelText, container } = render(
          <MockedProvider mocks={mocks} addTypename={ false }>
              <TodolistQuery url={ url } />
          </MockedProvider>
      )

      expect(getByText('Loading')).toBeDefined()

      // this shite halt execution until we find the said element
      const firstLabel = await findByLabelText('first list')

      expect(firstLabel).toBeDefined()
      
      expect(getByText('first list')).toHaveClass("completed")
      expect(getByText('first list')).toHaveStyle({textDecoration: "line-through"})

      // and will let this go correctly
      expect(getByText('second list')).toBeDefined()
      expect(getByText('third list')).toBeDefined()

      const forms = getAllByText('complete')
      expect(forms.length).toBe(3)

  });
})