'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Campaign } from '@/lib/supabase/client';
import { getCampaigns } from '@/lib/actions';

const FALLBACK_CLIENTS: Campaign[] = [
  {
    id: '1', name: 'Dank Drops', category: 'Viral Distribution', result: '+114%', price: '$4,500',
    description: 'Dank Drops needed reach... fast and at scale.\nThey were pulling in under 200 signups a day and needed volume to bring serious players into the game. We built out a full clipping campaign through ClipLaunch, flooded every major short-form platform, and let the numbers do the talking. In 90 days: 200M+ views. One individual video even hit 40M views. Daily signups scaled from under 200 to 2,000+. A 10x jump in under three months. When you need the internet to pay attention, you need volume.\nThat\'s what we do.',
    graph_data: '20,35,25,45,60,85,114',
    img_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    index_label: '01', tag: 'E-com',
    views_total: '200M+', roi: '10x', creators_count: '40M', budget_label: '$4.5K',
    cpm_label: '$0.38', duration_label: '90',
    sort_order: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: '2', name: 'Raza AI', category: 'Product Launch · SaaS', result: '+88%', price: '$6,200',
    description: 'Raza AI needed awareness... not impressions, real awareness.\nComplex AI tooling needed simplified messaging that resonated with non-technical audiences while maintaining credibility with developers. We created a 45-day content blitz with 35 tech-savvy creators producing explainer videos, tutorials, and "wow moment" demos. Educational content positioned as discovery rather than promotion, achieving 3x higher completion rates than standard SaaS ads.',
    graph_data: '10,15,30,40,55,70,88',
    img_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80',
    index_label: '02', tag: 'SaaS',
    views_total: '8.5M', roi: '9x', creators_count: '35', budget_label: '$6.2K',
    cpm_label: '$0.72', duration_label: '45',
    sort_order: 2, is_active: true, created_at: '', updated_at: '',
  },
];

const cleanStr = (s: string | undefined) => s?.replace(/^"+|"+$/g, '').trim() || '';

/* ═══════════════════════════════════════════════════════════════
   CLIENT CARD — Horizontal layout matching reference design
   Image left · Content right · Bottom metrics row
   ═══════════════════════════════════════════════════════════════ */
function ClientCard({ client: rawClient, index }: { client: Campaign; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const client = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = rawClient as any;
    return {
      ...rawClient,
      name: rawClient.name || r.title || '',
      img_url: rawClient.img_url || r.media_url || r.img || '',
      description: rawClient.description || r.purpose || '',
    };
  }, [rawClient]);

  /* Build metrics array from whatever admin has filled */
  const metrics = useMemo(() => {
    const m: { val: string; label: string }[] = [];
    if (client.views_total) m.push({ val: client.views_total, label: 'Total Views' });
    if (client.creators_count) m.push({ val: client.creators_count, label: 'Single Video' });
    if (client.roi) m.push({ val: client.roi, label: 'Signup Growth' });
    if (client.duration_label) m.push({ val: client.duration_label, label: 'Days' });
    /* Fallback: if admin didn't fill detailed metrics, show basic ones */
    if (m.length === 0) {
      if (client.result) m.push({ val: cleanStr(client.result), label: 'Growth' });
      if (client.price) m.push({ val: cleanStr(client.price), label: 'Budget' });
    }
    return m;
  }, [client]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="cc"
    >
      {/* ── Corner accent marks ── */}
      <span className="cc__corner cc__corner--tl" />
      <span className="cc__corner cc__corner--tr" />
      <span className="cc__corner cc__corner--bl" />
      <span className="cc__corner cc__corner--br" />

      {/* ── LEFT: Image ── */}
      <div className="cc__img-wrap">
        {client.img_url ? (
          <Image
            src={client.img_url}
            alt={cleanStr(client.name)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 38vw, 42vw"
            className="cc__img"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            priority={index === 0}
          />
        ) : (
          <div className="cc__img-placeholder" />
        )}
      </div>

      {/* ── RIGHT: Content ── */}
      <div className="cc__content">
        {/* Category / Tag */}
        <p className="cc__category">
          {cleanStr(client.category)}
          {client.tag && ` · ${cleanStr(client.tag)}`}
        </p>

        {/* Title */}
        <h3 className="cc__name">{cleanStr(client.name)}</h3>

        {/* Description — preserves line breaks from admin */}
        {client.description && (
          <div className="cc__desc">
            {cleanStr(client.description).split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Bottom metrics row */}
        {metrics.length > 0 && (
          <div className="cc__metrics">
            {metrics.map((m, i) => (
              <div key={i} className="cc__metric">
                <span className="cc__metric-val">{m.val}</span>
                <span className="cc__metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION CAMPAIGNS — Main export
   ═══════════════════════════════════════════════════════════════ */
export default function SectionCampaigns() {
  const [clients, setClients] = useState(FALLBACK_CLIENTS);

  useEffect(() => {
    getCampaigns()
      .then(data => { if (data && data.length > 0) setClients(data); })
      .catch(() => { /* fallback data already set */ });
  }, []);

  return (
    <section id="campaigns" className="clients-section">
      {/* Section header */}
      <div className="standard-container clients-section__header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <h2 className="section-title clients-section__title">Clients</h2>
          <p className="clients-section__subtitle">
            Proven distribution results across major niches.
          </p>
        </motion.div>
      </div>

      {/* Cards stack */}
      <div className="standard-container clients-section__cards">
        {clients.map((client, idx) => (
          <ClientCard key={client.id} client={client} index={idx} />
        ))}
      </div>
    </section>
  );
}
