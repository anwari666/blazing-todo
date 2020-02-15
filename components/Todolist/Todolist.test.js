/* eslint-env jest */
import React from 'react'
import TodolistQuery from './Todolist'
import { FETCH_TODOLIST, UPDATE_TODO, DELETE_TODO } from './Todolist.model'
import { MockedProvider } from '@apollo/react-testing'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { render, 
  cleanup, 
  fireEvent,
  wait,
  waitForElementToBeRemoved
} from '@testing-library/react'
// import wait from 'waait'
import "@testing-library/jest-dom"

let completeTodo = false;
let firstTodoDeleted = false;

const mocks= [{
    request: {
        query: FETCH_TODOLIST,
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
              "__typename": "todolist",
              "todos": [
                {
                  "completed": true,
                  "date_created": "2020-01-18T21:12:00.27135",
                  "id": "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4",
                  "label": "first todo",
                  "order": 1,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14",
                  "__typename": "todo"
                },
                {
                  "completed": true,
                  "date_created": "2020-01-18T23:46:36.28198",
                  "id": "9eeb351d-1eb7-4da8-af04-2a82593f1c04",
                  "label": "second todo",
                  "order": 2,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14",
                  "__typename": "todo"
                },
                {
                  "completed": false,
                  "date_created": "2020-01-28T00:04:07.583056",
                  "id": "609b9753-e59d-4c73-805d-5789d1ced5e5",
                  "label": "third todo",
                  "order": 3,
                  "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14",
                  "__typename": "todo"
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
      "label": "first todo",
      "order": 8,
      "todolist_id": "6efb65e3-9567-4d18-a205-aa2c102ccc14",
      "__typename": "todo"
    }
  ], "__typename": "todo_mutation_response"}}
}}
},{
  request: {
    query: DELETE_TODO,
    variables: {
        todo_id: "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4"
    }
  },
  result: () => {
    firstTodoDeleted = true
    return {
    "data": {
      "delete_todo": {
        "returning": [
          {
            "id": "40d3e176-e2af-431a-b3b2-8d4b2c1cd7c4",
            "label": "first todo",
            "completed": true,
            "__typename": "todo"
          }
        ],
        "__typename": "todo_mutation_response"
      }
    }
  }}
}]

describe("Todolist", () => {

    afterEach( cleanup )

    test("Should render loading then results correctly", async ()=>{
      const url = "firstlist"
      const cache = new InMemoryCache()

      const {getByLabelText, getByText, getByTestId, getAllByText, findByText, container, debug, rerender } = render(
          <MockedProvider mocks={mocks} addTypename={ true }>
              <TodolistQuery url={ url }/>
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

      const toggleButtons = getAllByText(/finish/i)
      expect(toggleButtons.length).toBe(3)

      // complete one element
      fireEvent.click(toggleButtons[0])

      let newTodo = await findByText(/first todo/i)
      expect(newTodo).toBeInTheDocument()
      expect(newTodo).not.toHaveStyle('text-decoration: line-through')
      
      const deleteButtons = getAllByText(/X/i)
      expect(deleteButtons.length).toBe(3)

      // delete one element
      fireEvent.click(deleteButtons[0])

      await waitForElementToBeRemoved(()=>( getByText(/first todo/i) ))
      expect( newTodo ).not.toBeInTheDocument()
      expect( firstTodoDeleted ).toBe(true)
      
      
  });
})