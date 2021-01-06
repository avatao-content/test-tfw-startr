import React from "react";
import {
  FrameworkColumn,
  LanguageColumn,
  StarterColumn,
  AllPackagesColumn,
  SelectedPackagesColumn,
} from "./columns";
import { DownloadButton } from "./button";
import styles from "./styles.module.css";

class Assembler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initData: props.data,
      languages: {
        all: Object.keys(props.data),
        selected: null,
      },
      frameworks: {
        all: null,
        selected: null,
      },
      starters: {
        all: null,
        selected: null,
      },
      packages: {
        all: null,
        required: null,
        selected: null,
      },
    };

    this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
    this.handleFrameworkSelect = this.handleFrameworkSelect.bind(this);
    this.handleStarterSelect = this.handleStarterSelect.bind(this);
    this.handleAddPackage = this.handleAddPackage.bind(this);
    this.handleRemovePackage = this.handleRemovePackage.bind(this);
    this.addExtraPackage = this.addExtraPackage.bind(this);
  }

  handleLanguageSelect(selectedLanguage) {
    this.setState({
      initData : this.state.initData,
      languages: {
        all: this.state.languages.all,
        selected: selectedLanguage,
      },
      frameworks: {
        all: Object.keys(this.state.initData[selectedLanguage].frameworks),
        selected: null,
      },
      starters: {
        all: null,
        selected: null,
      },
      packages: {
        all: null,
        required: null,
        selected: null,
      },
    });
  }

  handleFrameworkSelect(selectedFramework) {
    const startersForFramework = Object.keys(this.state.initData[this.state.languages.selected].frameworks[selectedFramework].starters);
    this.setState({
      initData : this.state.initData,
      languages: this.state.languages,
      frameworks: {
        all: this.state.frameworks.all,
        selected: selectedFramework,
      },
      starters: {
        all: startersForFramework,
        selected: null,
      },
      packages: {
        all: null,
        required: null,
        selected: null,
      },
    });
  }

  handleStarterSelect(selectedStarter) {
    fetch(
      `http://localhost:5000/api/v1/info?language=${this.state.languages.selected}&framework=${this.state.frameworks.selected}&starter=${selectedStarter}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          initData : this.state.initData,
          languages: this.state.languages,
          frameworks: this.state.frameworks,
          starters: {
            all: this.state.starters.all,
            selected: selectedStarter,
          },
          packages: {
            required: res.required,
            all: difference(res.optional, res.required),
            selected: JSON.parse(JSON.stringify(res.required))
            ,
          },
        });
      });
  }

  handleAddPackage(pkg) {
    this.setState({
      initData : this.state.initData,
      languages: this.state.languages,
      frameworks: this.state.frameworks,
      starters: this.state.starters,
      packages: {
        all: deletePackage(this.state.packages.all, pkg),
        required: this.state.packages.required,
        selected: addPackage(this.state.packages.selected, pkg),
      },
    });
  }

  handleRemovePackage(pkg) {
    this.setState({
      initData : this.state.initData,
      languages: this.state.languages,
      frameworks: this.state.frameworks,
      starters: this.state.starters,
      packages: {
        all: addPackage(this.state.packages.all, pkg),
        required: this.state.packages.required,
        selected: deletePackage(this.state.packages.selected, pkg),
      },
    });
  }

  addExtraPackage(pkg) {
    this.setState({
      initData : this.state.initData,
      languages: this.state.languages,
      frameworks: this.state.frameworks,
      starters: this.state.starters,
      packages: {
        all: this.state.packages.all,
        required: this.state.packages.required,
        selected: addPackage(this.state.packages.selected, pkg),
      },
    });
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.assembler}>
          <LanguageColumn
            languages={this.state.languages.all}
            name="languages"
            onLanguageSelect={this.handleLanguageSelect}
          />
          <FrameworkColumn
            frameworks={this.state.frameworks.all}
            name="frameworks"
            onFrameworkSelect={this.handleFrameworkSelect}
          />
          <StarterColumn
            starters={this.state.starters.all}
            name="starters"
            onStarterSelect={this.handleStarterSelect}
          />
          <SelectedPackagesColumn
            selectedPackages={this.state.packages.selected}
            requiredPackages={this.state.packages.required}
            onRemoveModule={this.handleRemovePackage}
            addExtraPackage={this.addExtraPackage}
          />
          <AllPackagesColumn
            allPackages={this.state.packages.all}
            onAddModule={this.handleAddPackage}
          />
        </div>

        <DownloadButton
          language={this.state.languages.selected}
          framework={this.state.frameworks.selected}
          starter={this.state.starters.selected}
          packages={this.state.packages.selected}
        />
      </div>
    );
  }
}

export default Assembler;

function difference(objA, objB) {
  const diff = {};
  for (const [key, value] of Object.entries(objA)) {
    if (! (key in objB) ) {
      diff[key] = value;
    }
  };
  return diff;
}

function deletePackage(obj, pkg) {
  delete obj[pkg.name];
  return obj;
}

function addPackage(obj, pkg) {
  obj[pkg.name] = pkg.version;
  return obj;
}