import { graphql, PageRendererProps, useStaticQuery } from 'gatsby';
import { DateTime } from 'luxon';
import React from 'react';
import styled from 'styled-components';
import { OriginalDate } from '../components/date';
import { Layout } from '../components/layout';
import { FadeLink } from '../components/link';
import { SEO } from '../components/seo';
import { MarkdownRemark } from '../graphql-types';
import { rhythm } from '../utils/typography';

const StyledLink = styled(FadeLink)`
  box-shadow: none;
`;

const Title = styled.h3`
  margin-bottom: ${rhythm(1 / 4)};
`;

type Props = PageRendererProps;

const BlogIndex = (props: Props) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date
              title
              description
            }
          }
        }
      }
    }
  `);

  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      {/* <Bio /> */}
      {posts.map(({ node }: { node: MarkdownRemark }) => {
        const frontmatter = node!.frontmatter!;
        const fields = node!.fields!;
        const slug = fields.slug!;
        const excerpt = node!.excerpt!;

        const title = frontmatter.title || fields.slug;
        return (
          <div key={slug}>
            <Title>
              <StyledLink to={slug}>{title}</StyledLink>
            </Title>
            <OriginalDate date={frontmatter.date} format={DateTime.DATE_FULL} />
            <p
              dangerouslySetInnerHTML={{
                __html: frontmatter.description || excerpt,
              }}
            />
          </div>
        );
      })}
    </Layout>
  );
};

export default BlogIndex;
