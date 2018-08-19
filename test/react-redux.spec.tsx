import { mount, shallow } from "enzyme";
import * as React from "react";
import { connect, Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import sinon from "sinon";
import { ActionType, createAction, createStandardAction, getType, StateType } from "typesafe-actions";

describe("react-redux", () => {
    interface ISFCCounter {
        count: number;
        onIncrement: () => any;
    }
    const Counter: React.SFC<ISFCCounter> = ({ count, onIncrement }) => (
        <div>
            <span>{count}</span>
            <button type="button" onClick={onIncrement}>Increment</button>
        </div>
    );

    describe("Stateless Functional Component", () => {
        const callback = sinon.spy();
        const wrapper = shallow(<Counter count={0} onIncrement={callback} />);
        it("has count", () => {
            expect(wrapper.find("span").at(0).text()).toBe("0");
        });
        it("has increment button", () => {
            wrapper.find("button").at(0).simulate("click");
            expect(callback.callCount).toBe(1);
        });
    });

    const increment = createAction("INCREMENT", (resolve) => () => resolve());
    interface IStatefullCounter {
        count: number;
    }
    type counterActions = ActionType<typeof increment>;
    const reducer = combineReducers<IStatefullCounter, counterActions>({
        count: (state = 0, action: counterActions) => {
            switch (action.type) {
                case getType(increment):
                    return state + 1;
                default:
                    return state;
            }
        },
    });
    class StatefullCounter extends React.Component<any, IStatefullCounter> {
        public readonly state: IStatefullCounter = reducer(undefined, {} as any);
        public render() {
            return (
                <div>
                    <span>{this.state.count}</span>
                    <button type="button" onClick={() => this.dispatch(increment())}>Increment</button>
                </div>
            );
        }
        private dispatch = (action: counterActions) => {
            this.setState(reducer(this.state, action));
        }
    }
    describe("Statefull Component", () => {
        const wrapper = shallow(<StatefullCounter />);
        it("has initial state", () => {
            expect(wrapper.find("span").at(0).text()).toBe("0");
        });

        it("has has increment button", () => {
            wrapper.find("button").at(0).simulate("click");

            expect(wrapper.find("span").at(0).text()).toBe("1");
        });
    });
    describe("Redux connected Component", () => {
        type RootState = StateType<typeof reducer>;
        type RootAction = counterActions; // Should be union

        const mapStateToProps = (state: RootState) => ({
            count: state.count,
        });
        const mapDispatchToProps = (dispatch: (action: RootAction) => any) => ({
            onIncrement: () => dispatch(increment()),
        });
        const Connected = connect(
            mapStateToProps,
            mapDispatchToProps,
        )(Counter);

        const store = createStore(reducer);

        const wrapper = mount(
            <Provider store={store}>
                <Connected />
            </Provider>,
        );
        it("has initial state", () => {
            expect(wrapper.find("span").at(0).text()).toBe("0");
        });

        it("has has increment button", () => {
            wrapper.find("button").at(0).simulate("click");

            expect(wrapper.find("span").at(0).text()).toBe("1");
        });
    });
});
