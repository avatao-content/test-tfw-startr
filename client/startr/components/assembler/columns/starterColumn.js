import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

class StarterColumn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    this.props.onStarterSelect(event.target.value);
  }

  render() {
    return (
      <div
        className={styles["column-wrapper"] + " " + styles["starter-column"]}
      >
        <div className={styles["column-header"]}>Starters</div>
        <div className={classNames(styles["column-content"], this.props.name)}>
          {this.props.starters ? (
            this.props.starters.map((starter) => (
              <div className={styles.row} key={classNames(starter, "item")}>
                <input
                  type="radio"
                  value={starter}
                  id={starter}
                  name={this.props.name}
                  onClick={this.handleSelect}
                />
                <label htmlFor={starter}>{starter}</label>
              </div>
            ))
          ) : (
            <div className={styles.message}> Please select a framework </div>
          )}
        </div>
      </div>
    );
  }
}

export default StarterColumn;
