import { observe } from "alo";
import { h, Component, FunctionalComponent, FunctionComponent } from "preact";
import { PureComponent } from "preact/compat";

export const observerHOC = function <P = {}>(
  TheComponent: FunctionalComponent<P>
): FunctionComponent<P> {
  return function (props) {
    props["view"] = TheComponent;

    return h(Observer as any, props);
  };
};

export class Observer extends Component<{ view? }> {
  updating = false;
  unobserve;
  renderedVnode;
  oldProps;
  oldState;

  startObserver() {
    if (this.unobserve) this.unobserve();
    this.unobserve = null;
    this.unobserve = observe(this.observer);
  }

  observer = () => {
    const viewParent = (this as any).view ? (this as any) : this.props;
    if (!viewParent) return;
    this.renderedVnode = viewParent.view(this.props, this.state);
    if (!this.unobserve) {
      return;
    }

    this.updating = true;
    this.forceUpdate();
  };

  componentwillUnmount() {
    if (this.unobserve) this.unobserve();
    this.unobserve = null;
  }

  render(props, state) {
    if (
      !this.updating &&
      (this.unobserve == null ||
        (this as any)._shouldComponentUpdate(this.oldProps, this.oldState))
    ) {
      this.startObserver();
    }

    this.updating = false;
    this.oldProps = props;
    this.oldState = state;

    return this.renderedVnode;
  }
}

(Observer.prototype as any)._shouldComponentUpdate =
  PureComponent.prototype.shouldComponentUpdate;
