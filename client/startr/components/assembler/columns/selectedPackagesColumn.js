import React from "react";
import classNames from "classnames";
import Modal from "../modal";
import { ModalToggleButton } from "../button";
import styles from "./styles.module.css";

class SelectedPackagesColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.removeModule = this.removeModule.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.addExtraPackage = this.addExtraPackage.bind(this);
  }

  removeModule(module) {
    this.props.onRemoveModule(module);
  }

  toggleModal() {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  }

  addExtraPackage(dependency) {
    this.props.addExtraPackage(dependency);
  }

  render() {
    return (
      <div
        className={
          styles["column-wrapper"] + " " + styles["module-column-selected"]
        }
      >
        <div className={styles["column-header"]}>
          Selected dependencies
          <br />
          <ModalToggleButton
            onClick={this.toggleModal}
            disabled={this.props.selectedPackages ? false : true}
          />
          <Modal
            isOpen={this.state.isModalOpen}
            onClose={this.toggleModal}
            onSave={this.addExtraPackage}
          />
        </div>
        <div className={styles["column-content"]}>
          {this.props.selectedPackages ? (
            Object.keys(this.props.selectedPackages).map((packageName) => (
              <div
                className={styles.row + " " + styles["double-row"]}
                key={classNames(packageName, "item")}
              >
                <div className={styles["row-header"]}>
                  {packageName}
                  <br />
                  {this.props.selectedPackages[packageName]}
                </div>
                {!(this.props.requiredPackages[packageName]) ? (
                  <button className={styles.btn}>
                  <i
                    className="fa fa-minus-circle"
                    onClick={(e) => this.removeModule({"name": packageName, "version": this.props.selectedPackages[packageName]})}
                  ></i>
                </button>
                ): console.log(this.props.selectedPackages)
                }
              </div>
            ))
          ) : (
            <div className={styles.message}> Please select a starter </div>
          )}
        </div>
      </div>
    );
  }
}

export default SelectedPackagesColumn;
