import React from 'react';
import Layout from '../components/Layout';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <main>
          <h1>Not Found</h1>
          <p>I haven’t written this post yet. Will you help me write it?</p>
          <iframe
            title="New Light by John Mayer on Youtube"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/mQ055hHdxbE"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullscreen
          />
        </main>
      </Layout>
    );
  }
}

export default NotFoundPage;
