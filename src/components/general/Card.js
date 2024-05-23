import { Component } from 'react'
import { Card } from 'react-bootstrap'

function InnerCard({ props, component }) {
  return class extends Component {
    render() {
      return <component {...this.props} {...props} />
    }
  }
}
function OuterCard(props) {
  return <InnerCard component={Card} {...props} />
}
