import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import React, { useState, useEffect } from "react";

let container: any;
beforeEach(() => {
  container = global.document.createElement("div");
  global.document.body.appendChild(container);
});
afterEach(() => {
  global.document.body.removeChild(container);
  container = null;
});

describe("React", () => {
  describe("Hooks at Glance https://reactjs.org/docs/hooks-overview.html", () => {
    const Example = () => {
      const [count, setCount] = useState(0);
      useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
      });
      return (
        <div>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
      );
    };
    let wrapper: any;
    act(() => {
      wrapper = mount(<Example />, container);
    });
    wrapper.find("button").at(0).simulate("click");

    it("useState handles local state", () => {
      expect(wrapper.find("p").text()).toBe("You clicked 1 times");
    });
    it("useEffect handles side effect", () => {
      expect(document.title).toBe("You clicked 1 times");
    });
  });
});
