// https://github.com/piotrwitek/react-redux-typescript-guide#redux
import { combineReducers, createStore } from "redux";
import { ActionType, createAction, createStandardAction, getType, StateType } from "typesafe-actions";

describe("typesafe-actions", () => {
    enum TodoActionTypes {
        completeAll = "COMPLETE_ALL",
        toggleTodo = "TOGGLE_TODO",
        addTodo = "ADD_TODO",
    }
    let id = 0;
    const actions = {
        addTodo: createAction(TodoActionTypes.addTodo, (resolve) => {
            id++;
            return (title: string) => resolve({ title, id, completed: false });
        }),
        completeAll: createAction(TodoActionTypes.completeAll),
        toggleTodo: createStandardAction(TodoActionTypes.toggleTodo)<number>(),
    };

    describe("action", () => {
        it("with type only", () => {
            expect(actions.completeAll()).toEqual({ type: TodoActionTypes.completeAll });
        });
        it("with payload without logic", () => {
            expect(actions.toggleTodo(1))
                .toEqual({ payload: 1, type: TodoActionTypes.toggleTodo });
        });
        it("with payload and logic", () => {
            expect(actions.addTodo("Learn TypeScript"))
                .toEqual({
                    payload: {
                        completed: false,
                        id: 1,
                        title: "Learn TypeScript",
                    },
                    type: TodoActionTypes.addTodo,
                });
        });
    });

    interface ITodo {
        title: string;
        id: number;
        completed: boolean;
    }
    type TodosAction = ActionType<typeof actions>;
    interface ITodosState {
        readonly todos: ITodo[];
    }
    const todos = (state: ITodo[] = [], action: TodosAction) => {
        switch (action.type) {
            case getType(actions.addTodo):
                return [...state, action.payload];
            case getType(actions.completeAll):
                return state.map((todo: ITodo) => ({ ...todo, completed: true }));
            case getType(actions.toggleTodo):
                return state.map((todo) => (
                    todo.id === action.payload
                        ? ({ ...todo, completed: !todo.completed })
                        : todo
                ));
            default:
                return state;
        }
    };
    const reducer = combineReducers<ITodosState, TodosAction>({
        todos,
    });
    describe("reducer", () => {
        it("returns initial state", () => {
            expect(reducer(undefined, {} as any).todos).toStrictEqual([]);
        });
        it("handles addTodo", () => {
            expect(reducer(undefined, actions.addTodo("Learn TypeScript")).todos)
                .toStrictEqual([{ title: "Learn TypeScript", id: 1, completed: false }]);
        });
        it("handles toggleTodo", () => {
            const before = {
                todos: [{ title: "Learn TypeScript", id: 1, completed: false }],
            };
            expect(reducer(before, actions.toggleTodo(1)).todos)
                .toStrictEqual([{ title: "Learn TypeScript", id: 1, completed: true }]);
            expect(reducer(before, actions.toggleTodo(2)).todos)
                .toStrictEqual([{ title: "Learn TypeScript", id: 1, completed: false }]);
        });
        it("handles completeAll", () => {
            const before = {
                todos: [
                    { title: "Learn TypeScript", id: 1, completed: false },
                    { title: "Learn redux", id: 2, completed: false },
                ],
            };
            const expected = [
                { title: "Learn TypeScript", id: 1, completed: true },
                { title: "Learn redux", id: 2, completed: true },
            ];
            expect(reducer(before, actions.completeAll()).todos).toStrictEqual(expected);
        });
    });

    describe("store", () => {
        type RootState = StateType<typeof reducer>;
        type RootAction = TodosAction;
        const store = createStore(reducer);

        it("returns initial state", () => {
            expect(store.getState()).toStrictEqual({ todos: [] });
        });

        it("can dispatch action", () => {
            store.dispatch(actions.addTodo("Learn TypeScript"));
            expect(store.getState()).toStrictEqual({
                todos: [{ title: "Learn TypeScript", id: 1, completed: false }],
            });
        });
    });
});
