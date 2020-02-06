/* eslint-env jest */
import React from 'react'
import TodolistQuery, { FETCH_TODO } from './Todolist'
import { UPDATE_TODO } from './Todo'
import { MockedProvider } from '@apollo/react-testing'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { render, 
  cleanup, 
  fireEvent,  
  wait
} from '@testing-library/react'
// import wait from 'waait'
import "@testing-library/jest-dom"

let completeTodo = false;

const mocks= [{
    request: {
        query: FETCH_TODO,
        variables: { todolist_url: "firstlist" }
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
                  "label": "first todo",
                  "order": 1,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                },
                {
                  "completed": true,
                  "date_created": "2020-01-18T23:46:36.28198",
                  "id": "9eeb351d-1eb7-4da8-af04-2a82593f1c04",
                  "label": "second todo",
                  "order": 2,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                },
                {
                  "completed": false,
                  "date_created": "2020-01-28T00:04:07.583056",
                  "id": "609b9753-e59d-4c73-805d-5789d1ced5e5",
                  "label": "third todo",
                  "order": 3,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
                }
              ]
            }
          ]
        }
      }    
},{
  request: {
      query: UPDATE_TODO,
      variables: {
        "todo_id": "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4",
        "completed": false,
        "label": "first todo"
    }
  },
  result:  () => { 
    completeTodo = true;

    return {"data":{"update_todo":{"affected_rows" : 1, "returning" : [
    {
      "completed": false,
      "date_created": "2020-01-18T21:12:00.27135",
      "id": "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4",
      "label": "new todo",
      "order": 8,
      "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14"
    }
  ]}}
}}
}]

describe("Todolist", () => {

    afterEach( cleanup )

    test("Should render loading then results correctly", async ()=>{
      const url = "firstlist"
      const cache = new InMemoryCache()

      
      const {getByLabelText, getByText, getByTestId, getAllByText, findByText, container, debug, rerender } = render(
          <MockedProvider mocks={mocks} addTypename={ false } defaultOptions={ {cache} }>
              <TodolistQuery url={ url } />
          </MockedProvider>
      )

      expect(getByText('Loading')).toBeDefined()

      // this shite halt execution until we find the said element
      const firstLabel = await findByText('first todo')

      expect(firstLabel).toBeDefined()
      
      expect(firstLabel).toHaveClass("completed")
      expect(firstLabel).toHaveStyle({textDecoration: "line-through"})

      // and will let this go correctly
      expect(getByText('second todo')).toBeDefined()
      expect(getByText('second todo')).toHaveStyle({textDecoration: "line-through"})

      expect(getByText('third todo')).toBeDefined()
      expect(getByText('third todo')).not.toHaveStyle({textDecoration: "line-through"})

      const completeButtons = getAllByText('finish')
      expect(completeButtons.length).toBe(3)

      // const firstTodoCompleteButton = getByTestId('complete-first-id')
      fireEvent.click(completeButtons[0])
      // fireEvent.click(completeButtons[1])
      // fireEvent.click(completeButtons[2])
      // rerender(
      //   <MockedProvider mocks={mocks} addTypename={ false } cache={ cache }>
      //       <TodolistQuery url={ url } />
      //   </MockedProvider>
      // )
      
      // expect(getByText('first todo')).not.toHaveClass("completed")

      
      await wait(  )
      // expect( completeTodo ).toBe(true)
      
      expect(container.firstChild).toMatchSnapshot()
      // expect(await findByText('new todo')).not.toHaveClass("completed")
      // debug()

      console.log( JSON.stringify( MockedProvider ));

      // await wait()
      // debug()
      // console.log(container.firstChild)

      // expect(getByText('new todo')).not.toHaveStyle({textDecoration: "line-through"})

  });
})