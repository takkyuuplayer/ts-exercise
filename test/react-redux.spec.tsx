import { shallow } from "enzyme";
import * as React from "react";
import sinon from "sinon";

describe("react-redux", () => {
    interface ICounter {
        count: number;
        onIncrement: () => any;
    }
    const Counter: React.SFC<ICounter> = ({ count, onIncrement }) => (
        <div>
            <span>{count}</span>
            <button type="button" onClick={onIncrement}>Increment</button>
        </div>
    );

    describe("Stateless Functional Component", () => {
        const callback = sinon.spy();
        const wrapper = shallow(<Counter count={0} onIncrement={callback} />);
        it("has count", () => {
            expect(wrapper.find("span").at(0).text).toBe(0);
        });
        it("has increment button", () => {
            wrapper.find("button").at(0).simulate("click");
            expect(callback.callCount).toBe(1);
        });
    });

});
