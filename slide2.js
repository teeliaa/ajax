$(document).ready(function() {
  let currentSlide = 0;

  function showSlide(index) {
    const slides = $('.slides');
    const totalSlides = slides.children().length;

    currentSlide = (index + totalSlides) % totalSlides;
    slides.css('transform', `translateX(-${currentSlide * 100}%)`);
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  window.loadContent = function(src) {
    const slides = $('.slides');
    const leftSection = $('.left');
    const rightSection = $('#content');

    // 슬라이드 숨기기
    slides.hide();

    // Ajax로 콘텐츠 로드
    $.ajax({
      url: src,
      dataType: 'html',
      success: function(data) {
        rightSection.html(data);
      },
      error: function() {
        rightSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    leftSection.show();
    rightSection.show();
  };

  window.loadFullSection = function(src) {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const container = $('.container');
    const contentSection = $('#content');

    // 모든 섹션 숨기기
    leftSection.hide();
    rightSection.hide();
    container.hide();

    // Ajax로 콘텐츠 로드 (풀 섹션 용)
    $.ajax({
      url: src,
      dataType: 'html',
      success: function(data) {
        contentSection.html(data).show();
      },
      error: function() {
        contentSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    $('html, body').css('overflow', 'hidden');
  };

  window.showHome = function() {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const slides = $('.slides');

    leftSection.show();
    rightSection.show();
    slides.show();

    $('html, body').css('overflow', 'auto');
  };
});
